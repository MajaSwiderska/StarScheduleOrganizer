import { projectId, publicAnonKey } from '../../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e8fe712f`;

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateScheduleData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

// Sign up a new user
export const signUp = async (email: string, password: string, name: string) => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Sign up error:', error);
    throw new Error(error.error || 'Failed to sign up');
  }

  return response.json();
};

// Get all schedules for the authenticated user
export const getSchedules = async (accessToken: string): Promise<Schedule[]> => {
  const response = await fetch(`${BASE_URL}/schedules`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error fetching schedules:', error);
    throw new Error(error.error || 'Failed to fetch schedules');
  }

  const data = await response.json();
  return data.schedules;
};

// Create a new schedule
export const createSchedule = async (accessToken: string, scheduleData: CreateScheduleData): Promise<Schedule> => {
  const response = await fetch(`${BASE_URL}/schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(scheduleData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error creating schedule:', error);
    throw new Error(error.error || 'Failed to create schedule');
  }

  const data = await response.json();
  return data.schedule;
};

// Update an existing schedule
export const updateSchedule = async (accessToken: string, scheduleId: string, scheduleData: CreateScheduleData): Promise<Schedule> => {
  const response = await fetch(`${BASE_URL}/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(scheduleData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error updating schedule:', error);
    throw new Error(error.error || 'Failed to update schedule');
  }

  const data = await response.json();
  return data.schedule;
};

// Delete a schedule
export const deleteSchedule = async (accessToken: string, scheduleId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/schedules/${scheduleId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error deleting schedule:', error);
    throw new Error(error.error || 'Failed to delete schedule');
  }
};
