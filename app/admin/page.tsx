"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Users, Calendar, CalendarDays, DollarSign } from 'lucide-react';

interface BookingType {
  id: number;
  event_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  amount: number;
  celebrities?: {
    name: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCelebrities: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState<BookingType[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch total celebrities
      const { count: celebritiesCount } = await supabase
        .from('celebrities')
        .select('*', { count: 'exact', head: true });

      // Fetch bookings statistics
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*');

      const pendingBookings = bookings?.filter(
        (booking) => booking.status === 'pending'
      ).length;

      // Fetch recent bookings
      const { data: recent } = await supabase
        .from('bookings')
        .select(`
          *,
          celebrities (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalCelebrities: celebritiesCount || 0,
        totalBookings: bookings?.length || 0,
        pendingBookings: pendingBookings || 0,
        totalRevenue: bookings?.reduce((acc, booking) => acc + (booking.amount || 0), 0) || 0,
      });

      setRecentBookings(recent || []);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Celebrities</p>
              <p className="text-2xl font-semibold">{stats.totalCelebrities}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-semibold">{stats.totalBookings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <CalendarDays className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
              <p className="text-2xl font-semibold">{stats.pendingBookings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Bookings */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Celebrity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking: any) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.celebrities?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(booking.event_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${booking.amount?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}