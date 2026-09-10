export type UserRole = "EXPORTER" | "PROVIDER" | "ADMIN";

export type ShipmentStatus =
  | "DRAFT"
  | "SEARCHING"
  | "BOOKED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type BookingStatus =
  | "CREATED"
  | "RESERVED"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type ProviderVerificationStatus =
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED";

export type ContainerStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "PARTIALLY_BOOKED"
  | "FULL"
  | "DEPARTED"
  | "COMPLETED";

export type MessageStatus = "SENT" | "DELIVERED" | "READ";

export type DisputeStatus =
  | "DISPUTE_CREATED"
  | "EVIDENCE_SUBMITTED"
  | "RESPONSE_REQUIRED"
  | "UNDER_REVIEW"
  | "RESOLVED";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
  phone?: string;
  city?: string;
  country?: string;
  status?: string;
  verificationStatus?: ProviderVerificationStatus;
  createdAt: string;
}

export interface Shipment {
  id: string;
  exporterId: string;
  route: {
    origin: string;
    destination: string;
  };
  cargo: {
    type: string;
    quantity: string;
    volume: number;
    weightKg: number;
    dimensions: string;
    packaging: string;
    fragile: boolean;
    temperatureControlled: boolean;
    hazardous: boolean;
    specialHandling: string;
    notes: string;
  };
  schedule: {
    readyDate: string;
    preferredDeparture: string;
    deliveryDeadline: string;
  };
  status: ShipmentStatus;
  bookingId?: string;
  createdAt: string;
}

export interface CapacityListing {
  id: string;
  providerId: string;
  providerName: string;
  route: {
    origin: string;
    destination: string;
  };
  containerType: string;
  containerIdentifier: string;
  totalCbm: number;
  availableCbm: number;
  totalWeightKg: number;
  availableWeightKg: number;
  departureDate: string;
  arrivalDate: string;
  transitTimeDays: number;
  pricePerCbm: number;
  currency: string;
  verificationStatus: "VERIFIED" | "PENDING";
  matchScore: number;
  status: ContainerStatus;
  cargoRestrictions: string;
  notes: string;
}

export interface Booking {
  id: string;
  shipmentId: string;
  exporterId: string;
  providerId: string;
  capacityId: string;
  status: BookingStatus;
  route: {
    origin: string;
    destination: string;
  };
  requestedCbm: number;
  requestedWeightKg: number;
  amount: number;
  currency: string;
  reservationExpiresAt?: string;
  createdAt: string;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  current: boolean;
}

export interface Conversation {
  id: string;
  userIds: string[];
  title: string;
  unreadCount: number;
  updatedAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
  status: MessageStatus;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: "BOOKING" | "APPROVAL" | "DOCUMENT" | "SHIPMENT";
  route: string;
  createdAt: string;
  read: boolean;
}

export interface Dispute {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: DisputeStatus;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  providerId: string;
  name: string;
  bookingId?: string;
  shipmentId?: string;
  dueDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
}

export interface ProviderProfile extends User {
  businessRegistrationId?: string;
  gstNumber?: string;
  address?: string;
  yearsInOperation?: number;
  serviceDescription?: string;
  operatingRegions?: string[];
  primaryRoutes?: string[];
  verificationStatus: ProviderVerificationStatus;
}

export interface StorageState {
  users: User[];
  shipments: Shipment[];
  capacities: CapacityListing[];
  bookings: Booking[];
  notifications: NotificationItem[];
  conversations: Conversation[];
  disputes: Dispute[];
  tasks: TaskItem[];
}
