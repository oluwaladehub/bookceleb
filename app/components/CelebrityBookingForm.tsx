"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Celebrity } from "../types/celebrity";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CelebrityBookingFormProps {
  celebrity: Celebrity;
}

export function CelebrityBookingForm({ celebrity }: CelebrityBookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [formData, setFormData] = useState({
    celebrityName: celebrity.name,
    eventDate: "",
    budget: "",
    eventType: "",
    location: "",
    message: "",
    fullName: "",
    jobTitle: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    airport: "",
    fullDescription: celebrity.fullDescription || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = [
        'eventDate',
        'budget',
        'eventType',
        'location',
        'fullName',
        'jobTitle',
        'gender',
        'phone',
        'email',
        'address',
        'airport'
      ];

      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      if (missingFields.length > 0) {
        setDialogMessage(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setShowDialog(true);
        return;
      }

      // Format the data for submission
      const bookingData = {
        celebrity_id: celebrity.id,
        event_date: new Date(formData.eventDate).toISOString(),
        budget: formData.budget,
        event_type: formData.eventType,
        location: formData.location,
        message: formData.message || '',
        full_name: formData.fullName,
        job_title: formData.jobTitle,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        airport: formData.airport,
        full_description: formData.fullDescription || '',
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select();

      if (error) {
        console.error('Booking submission error:', error);
        showToast.error(error.message);
        return;
      }

      // Send email notification
      const emailResponse = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingData: { ...bookingData, celebrityName: celebrity.name } }),
      });

      const responseData = await emailResponse.json();
      
      if (!emailResponse.ok) {
        throw new Error(responseData.error || 'Failed to send email notification');
      }

      showToast.success('Booking request submitted successfully!');
      // Reset form to initial state
      setFormData({
        celebrityName: celebrity.name,
        eventDate: "",
        budget: "",
        eventType: "",
        location: "",
        message: "",
        fullName: "",
        jobTitle: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        airport: "",
        fullDescription: celebrity.fullDescription || ""
      });
    } catch (error) {
      console.error('Form submission error:', error);
      showToast.error(error instanceof Error ? error.message : 'An error occurred while submitting the booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Form Validation Error</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDialog(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            value={celebrity.name}
            readOnly
            placeholder="Celebrity Name"
          />
          <Input
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <Textarea
          placeholder="Full Description"
          value={formData.fullDescription}
          onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
          className="min-h-[150px]"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            required
          >
            <option value="">Select Budget Range *</option>
            <option value="$5,000 or less">$5,000 or less</option>
            <option value="$5,000 - $10,000">$5,000 - $10,000</option>
            <option value="$10,000 - $20,000">$10,000 - $20,000</option>
            <option value="$20,000 - $30,000">$20,000 - $30,000</option>
            <option value="$30,000 - $50,000">$30,000 - $50,000</option>
            <option value="$50,000 - $100,000">$50,000 - $100,000</option>
            <option value="$100,000 - $500,000">$100,000 - $500,000</option>
            <option value="$500,000 and above">$500,000 and above</option>
          </select>

          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            required
          >
            <option value="">Type of Event *</option>
            <option value="Birthday">Birthday</option>
            <option value="Meet and Greet">Meet and Greet</option>
            <option value="Convention/Trade Show">Convention/Trade Show</option>
            <option value="Musical Performance">Musical Performance</option>
            <option value="Speaking Engagement">Speaking Engagement</option>
            <option value="Virtual Event">Virtual Event</option>
            <option value="Wedding">Wedding</option>
          </select>

          <Input
            placeholder="Event Location *"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <Textarea
          placeholder="Tell us about your event..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="min-h-[100px]"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <Input
            placeholder="Job Title *"
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            required
          />
          <Input
            placeholder="Gender *"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            placeholder="Phone Number *"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            placeholder="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            placeholder="Full Address *"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
          <Input
            placeholder="Nearest Airport *"
            value={formData.airport}
            onChange={(e) => setFormData({ ...formData, airport: e.target.value })}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#2F80ED] hover:bg-[#2F80ED]/90 text-lg py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
        </Button>
      </form>
    </>
  );
}