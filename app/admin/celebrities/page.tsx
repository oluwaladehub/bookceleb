"use client";

import { useState, useEffect } from 'react';
import { supabase, supabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { v4 as uuidv4 } from 'uuid';
import { showToast } from '@/lib/toast';

interface Celebrity {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  fee_range: string;
  availability: boolean;
  full_description?: string;
}

export default function CelebritiesManagement() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Celebrity, 'id'>>({    name: '',
    image: '',
    description: '',
    category: '',
    fee_range: '',
    availability: true,
    full_description: ''
  });

  useEffect(() => {
    fetchCelebrities();
  }, []);

  const fetchCelebrities = async () => {
    const { data, error } = await supabase
      .from('celebrities')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching celebrities:', error);
      return;
    }

    setCelebrities(data || []);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `celebrities/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;

      const fileInput = document.querySelector<HTMLInputElement>('input[type=file]');
      if (fileInput?.files?.[0]) {
        try {
          imageUrl = await handleImageUpload(fileInput.files[0]);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          showToast.error('Error uploading image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      const updatedFormData = { ...formData, image: imageUrl };

      if (editingId) {
        const { error } = await supabase
          .from('celebrities')
          .update(updatedFormData)
          .eq('id', editingId);

        if (error) {
          console.error('Error updating celebrity:', error);
          showToast.error('Error updating celebrity. Please try again.');
          setIsSubmitting(false);
          return;
        }
      } else {
        const { error } = await supabase
          .from('celebrities')
          .insert([updatedFormData]);

        if (error) {
          console.error('Error creating celebrity:', error);
          showToast.error('Error creating celebrity. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      setFormData({
        name: '',
        image: '',
        description: '',
        category: '',
        fee_range: '',
        availability: true,
        full_description: ''
      });
      setIsAddingNew(false);
      setEditingId(null);
      fetchCelebrities();
      showToast.success('Celebrity saved successfully!');
    } catch (error) {
      console.error('Error saving celebrity:', error);
      showToast.error('Error saving celebrity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('celebrities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting celebrity:', error);
        showToast.error('Error deleting celebrity. Please try again.');
        return;
      }

      showToast.success('Celebrity deleted successfully!');
      fetchCelebrities();
    } catch (error) {
      console.error('Error deleting celebrity:', error);
      showToast.error('Error deleting celebrity. Please try again.');
    }
  };

  const handleEdit = (celebrity: Celebrity) => {
    setFormData({
      name: celebrity.name,
      image: celebrity.image,
      description: celebrity.description,
      category: celebrity.category,
      fee_range: celebrity.fee_range,
      availability: celebrity.availability,
      full_description: celebrity.full_description || ''
    });
    setEditingId(celebrity.id);
    setIsAddingNew(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Celebrities Management</h1>
        <Button
          onClick={() => setIsAddingNew(true)}
          className="w-full sm:w-auto bg-[#2F80ED] hover:bg-[#2F80ED]/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Celebrity
        </Button>
      </div>

      {isAddingNew && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Celebrity' : 'Add New Celebrity'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Celebrity Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full"
              />
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="border-2 border-dashed rounded-lg p-4 hover:border-[#2F80ED] transition-colors"
                />
                {formData.image && (
                  <div className="relative w-32 h-32 mx-auto sm:mx-0">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              <Input
                placeholder="Category (e.g., Actor, Musician)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full"
              />
              <Input
                placeholder="Fee Range"
                value={formData.fee_range}
                onChange={(e) => setFormData({ ...formData, fee_range: e.target.value })}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              <Textarea
                placeholder="Short Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="min-h-[100px] w-full"
              />
              <Textarea
                placeholder="Full Description (Detailed information about the celebrity)"
                value={formData.full_description || ''}
                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                className="min-h-[200px] w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    image: '',
                    description: '',
                    category: '',
                    fee_range: '',
                    availability: true,
                    full_description: ''
                  });
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-[#2F80ED] hover:bg-[#2F80ED]/90" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{editingId ? 'Update' : 'Add'} Celebrity</>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Celebrity
              </th>
              <th className="hidden sm:table-cell px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="hidden sm:table-cell px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee Range
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {celebrities.map((celebrity) => (
              <tr key={celebrity.id}>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={celebrity.image}
                      alt={celebrity.name}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                    />
                    <div className="ml-3 sm:ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {celebrity.name}
                      </div>
                      <div className="text-sm text-gray-500 sm:hidden">
                        {celebrity.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{celebrity.category}</div>
                </td>
                <td className="hidden sm:table-cell px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{celebrity.fee_range}</div>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleEdit(celebrity)}
                      className="p-1 sm:p-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:text-red-800 p-1 sm:p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Celebrity</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this celebrity? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(celebrity.id)}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}