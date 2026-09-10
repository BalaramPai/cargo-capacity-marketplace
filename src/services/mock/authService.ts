import { mockUsers } from "./data";
import { getStorageKey, readStorage, removeStorage, writeStorage } from "../../lib/storage";
import type { User, UserRole } from "../../types";

const AUTH_KEY = "auth_user";
const USERS_KEY = "mock_users";

const ensureUsers = () => {
  const saved = readStorage<User[]>(USERS_KEY, []);
  if (saved.length > 0) return saved;

  writeStorage<User[]>(USERS_KEY, mockUsers);
  return mockUsers;
};

export const authService = {
  getUsers() {
    return ensureUsers();
  },

  login(email: string, password: string) {
    const users = ensureUsers();
    const match = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
    );

    if (!match) {
      return null;
    }

    writeStorage(AUTH_KEY, match);
    return match;
  },

  getCurrentUser() {
    return readStorage<User | null>(AUTH_KEY, null);
  },

  logout() {
    removeStorage(AUTH_KEY);
  },

  isAuthenticated() {
    return Boolean(this.getCurrentUser());
  },

  getRoleFromUser(user: User | null): UserRole | null {
    return user ? user.role : null;
  },

  registerExporter(data: {
    fullName: string;
    workEmail: string;
    phoneNumber: string;
    companyName: string;
    companyType: string;
    businessIdentifier: string;
    businessAddress: string;
    city: string;
    country: string;
    password: string;
  }) {
    const users = ensureUsers();
    const existing = users.find((user) => user.email.toLowerCase() === data.workEmail.toLowerCase());

    if (existing) {
      return { ok: false, message: "An account with this email already exists." };
    }

    const newUser: User = {
      id: `user-exporter-${Date.now()}`,
      name: data.fullName,
      email: data.workEmail,
      password: data.password,
      role: "EXPORTER",
      companyName: data.companyName,
      phone: data.phoneNumber,
      city: data.city,
      country: data.country,
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeStorage(USERS_KEY, users);
    writeStorage(AUTH_KEY, newUser);

    return { ok: true, user: newUser };
  },

  registerProvider(data: {
    fullName: string;
    workEmail: string;
    phoneNumber: string;
    companyName: string;
    companyType: string;
    registrationId: string;
    gstNumber: string;
    address: string;
    city: string;
    country: string;
    yearsInOperation: string;
    serviceDescription: string;
    operatingRegions: string;
    primaryRoutes: string;
    password: string;
  }) {
    const users = ensureUsers();
    const existing = users.find((user) => user.email.toLowerCase() === data.workEmail.toLowerCase());

    if (existing) {
      return { ok: false, message: "An account with this email already exists." };
    }

    const newUser: User = {
      id: `user-provider-${Date.now()}`,
      name: data.fullName,
      email: data.workEmail,
      password: data.password,
      role: "PROVIDER",
      companyName: data.companyName,
      phone: data.phoneNumber,
      city: data.city,
      country: data.country,
      status: "Pending",
      verificationStatus: "PENDING_VERIFICATION",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeStorage(USERS_KEY, users);
    writeStorage(AUTH_KEY, newUser);

    return { ok: true, user: newUser };
  },
};

export const getAuthKey = () => getStorageKey(AUTH_KEY);
