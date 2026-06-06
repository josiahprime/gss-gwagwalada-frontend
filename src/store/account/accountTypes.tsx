export interface AccountState {
  name: string;
  email: string;
  phone: string;
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  // ✅ Address fields
  fullName: string;
  state: string;
  city: string;
  address: string;
  landmark?: string;
  postalCode?: string;

  // ✅ Setters
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;

  setFullName: (name: string) => void;
  setStateField: (stateValue: string) => void;
  setCity: (city: string) => void;
  setAddress: (address: string) => void;
  setLandmark: (landmark: string) => void;
  setPostalCode: (postalCode: string) => void;

  // ✅ Actions
  // updateName: (userId: string, username: string) => Promise<void>;
  // updateEmail: (userId: string, email: string) => Promise<void>;
  // updatePhone: (userId: string, phone: string) => Promise<void>;
  updateEmail: (userId: string, email: string) => Promise<{ message: string }>;
  updatePhone: (userId: string, phone: string) => Promise<{ message: string }>;
  updateName: (userId: string, username: string) => Promise<{ message: string }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateAddress: (data: AddressData) => Promise<void>;
  fetchAddress: () => Promise<void>;
  deleteUser: (userId: string) => Promise<{ message: string }>;
}

export interface AddressData {
  userId: string;
  fullName: string;
  email: string;
  state: string;
  city: string;
  address: string;
  landmark?: string;
  postalCode?: string;
}

