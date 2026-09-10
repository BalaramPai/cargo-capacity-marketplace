import { mockBookings, mockCapacityListings, mockConversations, mockDisputes, mockNotifications, mockShipments, mockTasks, mockTrackingEvents, mockUsers } from "./data";
import { readStorage, writeStorage } from "../../lib/storage";
import type { Booking, CapacityListing, Conversation, Dispute, Message, NotificationItem, Shipment, TaskItem } from "../../types";

const STORAGE_KEYS = {
  shipments: "shipments",
  capacity: "capacity",
  bookings: "bookings",
  notifications: "notifications",
  messages: "messages",
  tasks: "tasks",
  disputes: "disputes",
};

function getStored<T>(key: string, fallback: T): T {
  return readStorage<T>(key, fallback);
}

function saveStored<T>(key: string, value: T) {
  writeStorage(key, value);
}

export const marketplaceService = {
  getShipments() {
    return getStored<Shipment[]>(STORAGE_KEYS.shipments, mockShipments);
  },

  getShipment(id: string) {
    return this.getShipments().find((shipment) => shipment.id === id) ?? null;
  },

  createShipment(payload: Partial<Shipment>) {
    const shipments = this.getShipments();
    const item: Shipment = {
      id: payload.id ?? `CL-SHP-${Date.now()}`,
      exporterId: payload.exporterId ?? "user-exporter-1",
      route: payload.route ?? { origin: "", destination: "" },
      cargo: payload.cargo ?? {
        type: "General cargo",
        quantity: "1 lot",
        volume: 0,
        weightKg: 0,
        dimensions: "",
        packaging: "Cartonized",
        fragile: false,
        temperatureControlled: false,
        hazardous: false,
        specialHandling: "",
        notes: "",
      },
      schedule: payload.schedule ?? {
        readyDate: "",
        preferredDeparture: "",
        deliveryDeadline: "",
      },
      status: payload.status ?? "DRAFT",
      createdAt: payload.createdAt ?? new Date().toISOString(),
    };

    shipments.unshift(item);
    saveStored(STORAGE_KEYS.shipments, shipments);
    return item;
  },

  updateShipment(id: string, updates: Partial<Shipment>) {
    const shipments = this.getShipments();
    const index = shipments.findIndex((shipment) => shipment.id === id);
    if (index === -1) return null;

    shipments[index] = { ...shipments[index], ...updates };
    saveStored(STORAGE_KEYS.shipments, shipments);
    return shipments[index];
  },

  getCapacityListings() {
    return getStored<CapacityListing[]>(STORAGE_KEYS.capacity, mockCapacityListings);
  },

  getCapacity(id: string) {
    return this.getCapacityListings().find((entry) => entry.id === id) ?? null;
  },

  searchCapacity(filters: {
    origin?: string;
    destination?: string;
    minVolume?: number;
    minWeight?: number;
    containerType?: string;
    verifiedOnly?: boolean;
    maxPrice?: number;
  }) {
    const listings = this.getCapacityListings();
    return listings.filter((entry) => {
      const originMatch = !filters.origin || entry.route.origin.toLowerCase().includes(filters.origin.toLowerCase());
      const destinationMatch = !filters.destination || entry.route.destination.toLowerCase().includes(filters.destination.toLowerCase());
      const volumeMatch = !filters.minVolume || entry.availableCbm >= filters.minVolume;
      const weightMatch = !filters.minWeight || entry.availableWeightKg >= filters.minWeight;
      const typeMatch = !filters.containerType || filters.containerType === "All types" || entry.containerType === filters.containerType;
      const verifiedMatch = !filters.verifiedOnly || entry.verificationStatus === "VERIFIED";
      const priceMatch = !filters.maxPrice || entry.pricePerCbm <= filters.maxPrice;

      return originMatch && destinationMatch && volumeMatch && weightMatch && typeMatch && verifiedMatch && priceMatch;
    });
  },

  createCapacity(payload: Partial<CapacityListing>) {
    const entries = this.getCapacityListings();
    const item: CapacityListing = {
      id: payload.id ?? `CL-CAP-${Date.now()}`,
      providerId: payload.providerId ?? "user-provider-1",
      providerName: payload.providerName ?? "OceanBridge Logistics",
      route: payload.route ?? { origin: "", destination: "" },
      containerType: payload.containerType ?? "40 FT Container",
      containerIdentifier: payload.containerIdentifier ?? "",
      totalCbm: payload.totalCbm ?? 0,
      availableCbm: payload.availableCbm ?? 0,
      totalWeightKg: payload.totalWeightKg ?? 0,
      availableWeightKg: payload.availableWeightKg ?? 0,
      departureDate: payload.departureDate ?? "",
      arrivalDate: payload.arrivalDate ?? "",
      transitTimeDays: payload.transitTimeDays ?? 0,
      pricePerCbm: payload.pricePerCbm ?? 0,
      currency: payload.currency ?? "USD",
      verificationStatus: payload.verificationStatus ?? "PENDING",
      matchScore: payload.matchScore ?? 90,
      status: payload.status ?? "DRAFT",
      cargoRestrictions: payload.cargoRestrictions ?? "",
      notes: payload.notes ?? "",
    };

    entries.unshift(item);
    saveStored(STORAGE_KEYS.capacity, entries);
    return item;
  },

  getBookings() {
    return getStored<Booking[]>(STORAGE_KEYS.bookings, mockBookings);
  },

  getBooking(id: string) {
    return this.getBookings().find((booking) => booking.id === id) ?? null;
  },

  createBooking(payload: Omit<Booking, "id" | "createdAt"> & { id?: string }) {
    const bookings = this.getBookings();
    const item: Booking = {
      ...payload,
      id: payload.id ?? `CL-BKG-${Date.now()}`,
      status: payload.status ?? "RESERVED",
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(item);
    saveStored(STORAGE_KEYS.bookings, bookings);
    return item;
  },

  updateBooking(id: string, status: Booking["status"]) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;

    bookings[index] = { ...bookings[index], status };
    saveStored(STORAGE_KEYS.bookings, bookings);
    return bookings[index];
  },

  getNotifications(userId: string) {
    const all = getStored<NotificationItem[]>(STORAGE_KEYS.notifications, mockNotifications);
    return all.filter((notification) => notification.userId === userId);
  },

  getMessages() {
    return getStored<Conversation[]>(STORAGE_KEYS.messages, mockConversations);
  },

  sendMessage(conversationId: string, senderId: string, senderRole: "EXPORTER" | "PROVIDER" | "ADMIN", text: string) {
    const conversations = this.getMessages();
    const conversation = conversations.find((item) => item.id === conversationId);
    if (!conversation) return null;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderRole,
      text,
      createdAt: new Date().toISOString(),
      status: "SENT",
    };

    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date().toISOString();
    conversation.unreadCount = 0;
    saveStored(STORAGE_KEYS.messages, conversations);
    return newMessage;
  },

  getTrackingEvents(shipmentId: string) {
    return mockTrackingEvents.filter((event) => event.shipmentId === shipmentId);
  },

  getDisputes() {
    return getStored<Dispute[]>(STORAGE_KEYS.disputes, mockDisputes);
  },

  updateDispute(id: string, status: Dispute["status"]) {
    const disputes = this.getDisputes();
    const index = disputes.findIndex((dispute) => dispute.id === id);
    if (index === -1) return null;

    disputes[index] = { ...disputes[index], status };
    saveStored(STORAGE_KEYS.disputes, disputes);
    return disputes[index];
  },

  getTasks(providerId: string) {
    const tasks = getStored<TaskItem[]>(STORAGE_KEYS.tasks, mockTasks);
    return tasks.filter((task) => task.providerId === providerId);
  },

  updateTask(id: string, status: TaskItem["status"]) {
    const tasks = getStored<TaskItem[]>(STORAGE_KEYS.tasks, mockTasks);
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    tasks[index] = { ...tasks[index], status };
    saveStored(STORAGE_KEYS.tasks, tasks);
    return tasks[index];
  },

  getUsers() {
    return mockUsers;
  },
};
