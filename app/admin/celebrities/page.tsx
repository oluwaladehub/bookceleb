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

    try {
      let imageUrl = formData.image;

      const fileInput = document.querySelector<HTMLInputElement>('input[type=file]');
      if (fileInput?.files?.[0]) {
        try {
          imageUrl = await handleImageUpload(fileInput.files[0]);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          showToast.error('Error uploading image. Please try again.');
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
          return;
        }
      } else {
        const { error } = await supabase
          .from('celebrities')
          .insert([updatedFormData]);

        if (error) {
          console.error('Error creating celebrity:', error);
          showToast.error('Error creating celebrity. Please try again.');
          return;
        }
      }

      setFormData({
        name: '',
        image: '',
        description: '',
        category: '',
        fee_range: '',
        availability: true
      });
      setIsAddingNew(false);
      setEditingId(null);
      fetchCelebrities();
      showToast.success('Celebrity saved successfully!');
    } catch (error) {
      console.error('Error saving celebrity:', error);
      showToast.error('Error saving celebrity. Please try again.');
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
    setFormData(celebrity);
    setEditingId(celebrity.id);
    setIsAddingNew(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Celebrities Management</h1>
        <Button
          onClick={() => setIsAddingNew(true)}
          className="bg-[#2F80ED] hover:bg-[#2F80ED]/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Celebrity
        </Button>
      </div>

      {isAddingNew && (
        <div className="bg-white p-6 rounded-lg shadow">
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
              />
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Preview the image
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
                  <div className="relative w-32 h-32">
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
              />
              <Input
                placeholder="Fee Range"
                value={formData.fee_range}
                onChange={(e) => setFormData({ ...formData, fee_range: e.target.value })}
                required
              />
            </div>
            <div className="space-y-4">
              <Textarea
                placeholder="Short Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="min-h-[100px]"
              />
              <Textarea
                placeholder="Full Description (Detailed information about the celebrity)"
                value={formData.full_description || ''}
                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                className="min-h-[200px]"
              />
            </div>
            <div className="flex justify-end gap-4">
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
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2F80ED] hover:bg-[#2F80ED]/90">
                {editingId ? 'Update' : 'Add'} Celebrity
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Celebrity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {celebrities.map((celebrity) => (
              <tr key={celebrity.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={celebrity.image}
                      alt={celebrity.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {celebrity.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{celebrity.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{celebrity.fee_range}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleEdit(celebrity)}
                    className="mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Celebrity</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this celebrity? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(celebrity.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}