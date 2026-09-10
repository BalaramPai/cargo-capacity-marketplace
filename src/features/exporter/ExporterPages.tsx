import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import AppShell from "../../components/app/AppShell";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { marketplaceService } from "../../services/mock/marketplaceService";

type StatusTone = "blue" | "green" | "amber" | "red" | "slate";

const shipmentStatusTone: Record<string, StatusTone> = {
  DRAFT: "slate",
  SEARCHING: "blue",
  BOOKED: "amber",
  IN_TRANSIT: "green",
  DELIVERED: "green",
  CANCELLED: "red",
};

const bookingStatusTone: Record<string, StatusTone> = {
  CREATED: "slate",
  RESERVED: "amber",
  PAYMENT_PENDING: "blue",
  CONFIRMED: "green",
  COMPLETED: "green",
  CANCELLED: "red",
  EXPIRED: "red",
};

export function ExporterDashboardPage() {
  const { currentUser } = useAuth();
  const shipments = marketplaceService.getShipments().filter((item) => item.exporterId === currentUser?.id);

  const stats = {
    activeShipments: shipments.filter((item) => item.status !== "DELIVERED" && item.status !== "CANCELLED").length,
    pendingBookings: marketplaceService.getBookings().filter((booking) => booking.exporterId === currentUser?.id && booking.status !== "CONFIRMED" && booking.status !== "COMPLETED").length,
    inTransit: shipments.filter((item) => item.status === "IN_TRANSIT").length,
    delivered: shipments.filter((item) => item.status === "DELIVERED").length,
  };

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader
          title={`Good morning, ${currentUser?.name || "Exporter"}`}
          subtitle="Move your cargo with available capacity."
          actions={
            <>
              <Button variant="primary" onClick={() => window.location.assign("/exporter/shipments/new")}>Create shipment</Button>
              <Button variant="secondary" onClick={() => window.location.assign("/exporter/capacity")}>Find capacity</Button>
            </>
          }
        />

        <section className="stats-grid">
          <StatCard label="Active shipments" value={stats.activeShipments} accent="blue" />
          <StatCard label="Pending bookings" value={stats.pendingBookings} accent="orange" />
          <StatCard label="In transit" value={stats.inTransit} accent="green" />
          <StatCard label="Delivered" value={stats.delivered} accent="purple" />
        </section>

        <section className="card-panel">
          <div className="section-heading-row">
            <h3>Recent shipments</h3>
            <Link to="/exporter/shipments">View all</Link>
          </div>

          <div className="list-stack">
            {shipments.slice(0, 3).map((shipment) => (
              <Link key={shipment.id} to={`/exporter/shipments/${shipment.id}`} className="list-card">
                <div>
                  <strong>{shipment.route.origin} → {shipment.route.destination}</strong>
                  <p>{shipment.cargo.volume} CBM · {shipment.cargo.weightKg.toLocaleString()} KG</p>
                  <small>Ready {shipment.schedule.readyDate}</small>
                </div>
                <div className="list-card-meta">
                  <StatusBadge status={shipment.status} tone={shipmentStatusTone[shipment.status] || "slate"} />
                  <span>View</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export function ExporterShipmentsPage() {
  const { currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const items = useMemo(() => {
    const shipments = marketplaceService.getShipments().filter((item) => item.exporterId === currentUser?.id);

    return shipments.filter((item) => {
      const matchesQuery = !query || `${item.route.origin} ${item.route.destination}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [currentUser?.id, query, statusFilter]);

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader
          title="My shipments"
          subtitle="Track the status of each shipment and manage next actions."
          actions={<Button variant="primary" onClick={() => window.location.assign("/exporter/shipments/new")}>Create shipment</Button>}
        />

        <div className="filter-bar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search route" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="SEARCHING">SEARCHING</option>
            <option value="BOOKED">BOOKED</option>
            <option value="IN_TRANSIT">IN_TRANSIT</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="table-card">
          {items.length === 0 ? (
            <div className="empty-state">No shipments match the current filters.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Shipment ID</th>
                  <th>Volume</th>
                  <th>Weight</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>{shipment.route.origin} → {shipment.route.destination}</td>
                    <td>{shipment.id}</td>
                    <td>{shipment.cargo.volume} CBM</td>
                    <td>{shipment.cargo.weightKg.toLocaleString()} KG</td>
                    <td><StatusBadge status={shipment.status} tone={shipmentStatusTone[shipment.status] || "slate"} /></td>
                    <td><Link to={`/exporter/shipments/${shipment.id}`}>Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export function ExporterShipmentFormPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [state, setState] = useState({
    origin: "",
    destination: "",
    cargoType: "General cargo",
    quantity: "1 lot",
    volume: "",
    weightKg: "",
    dimensions: "",
    packaging: "Palletized",
    readyDate: "",
    preferredDeparture: "",
    deliveryDeadline: "",
    fragile: false,
    temperatureControlled: false,
    hazardous: false,
    specialHandling: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!state.origin || !state.destination || !state.volume || !state.weightKg || !state.readyDate) {
      setError("Please complete the route, cargo volume, weight, and ready date.");
      return;
    }

    const shipment = marketplaceService.createShipment({
      exporterId: currentUser?.id ?? "user-exporter-1",
      route: { origin: state.origin, destination: state.destination },
      cargo: {
        type: state.cargoType,
        quantity: state.quantity,
        volume: Number(state.volume),
        weightKg: Number(state.weightKg),
        dimensions: state.dimensions,
        packaging: state.packaging,
        fragile: state.fragile,
        temperatureControlled: state.temperatureControlled,
        hazardous: state.hazardous,
        specialHandling: state.specialHandling,
        notes: state.notes,
      },
      schedule: {
        readyDate: state.readyDate,
        preferredDeparture: state.preferredDeparture,
        deliveryDeadline: state.deliveryDeadline,
      },
      status: "SEARCHING",
    });

    navigate(`/exporter/shipments/${shipment.id}`);
  };

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader title="Create shipment" subtitle="Define your cargo and route before searching for capacity." />

        <form className="stacked-form" onSubmit={handleSubmit}>
          {error ? <div className="form-error">{error}</div> : null}

          <div className="form-section">
            <h3>Route</h3>
            <div className="form-grid two-col">
              <label>
                Origin
                <input value={state.origin} onChange={(e) => setState({ ...state, origin: e.target.value })} placeholder="Mumbai" />
              </label>
              <label>
                Destination
                <input value={state.destination} onChange={(e) => setState({ ...state, destination: e.target.value })} placeholder="Rotterdam" />
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Cargo</h3>
            <div className="form-grid two-col">
              <label>
                Cargo type
                <input value={state.cargoType} onChange={(e) => setState({ ...state, cargoType: e.target.value })} />
              </label>
              <label>
                Quantity
                <input value={state.quantity} onChange={(e) => setState({ ...state, quantity: e.target.value })} />
              </label>
              <label>
                Volume CBM
                <input type="number" value={state.volume} onChange={(e) => setState({ ...state, volume: e.target.value })} />
              </label>
              <label>
                Weight KG
                <input type="number" value={state.weightKg} onChange={(e) => setState({ ...state, weightKg: e.target.value })} />
              </label>
              <label>
                Dimensions
                <input value={state.dimensions} onChange={(e) => setState({ ...state, dimensions: e.target.value })} />
              </label>
              <label>
                Packaging type
                <input value={state.packaging} onChange={(e) => setState({ ...state, packaging: e.target.value })} />
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Schedule</h3>
            <div className="form-grid two-col">
              <label>
                Cargo ready date
                <input type="date" value={state.readyDate} onChange={(e) => setState({ ...state, readyDate: e.target.value })} />
              </label>
              <label>
                Preferred departure
                <input type="date" value={state.preferredDeparture} onChange={(e) => setState({ ...state, preferredDeparture: e.target.value })} />
              </label>
              <label>
                Delivery deadline
                <input type="date" value={state.deliveryDeadline} onChange={(e) => setState({ ...state, deliveryDeadline: e.target.value })} />
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Requirements</h3>
            <div className="check-grid">
              <label><input type="checkbox" checked={state.fragile} onChange={(e) => setState({ ...state, fragile: e.target.checked })} /> Fragile</label>
              <label><input type="checkbox" checked={state.temperatureControlled} onChange={(e) => setState({ ...state, temperatureControlled: e.target.checked })} /> Temperature controlled</label>
              <label><input type="checkbox" checked={state.hazardous} onChange={(e) => setState({ ...state, hazardous: e.target.checked })} /> Hazardous</label>
            </div>
            <label>
              Special handling
              <textarea value={state.specialHandling} onChange={(e) => setState({ ...state, specialHandling: e.target.value })} rows={3} />
            </label>
            <label>
              Notes
              <textarea value={state.notes} onChange={(e) => setState({ ...state, notes: e.target.value })} rows={3} />
            </label>
          </div>

          <div className="form-actions row-actions">
            <Button type="button" variant="secondary" onClick={() => navigate("/exporter/shipments")}>Back</Button>
            <Button type="submit" variant="primary">Submit / Find capacity</Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export function ExporterShipmentDetailPage() {
  const { shipmentId } = useParams();
  const shipment = marketplaceService.getShipment(String(shipmentId));

  if (!shipment) {
    return <AppShell role="EXPORTER"><div className="page-stack"><div className="empty-state">Shipment not found.</div></div></AppShell>;
  }

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader
          title={shipment.id}
          subtitle={`${shipment.route.origin} → ${shipment.route.destination}`}
          actions={<Button variant="primary" onClick={() => window.location.assign(`/exporter/capacity`)}>Find capacity</Button>}
        />

        <div className="detail-grid">
          <div className="card-panel">
            <h3>Shipment summary</h3>
            <div className="detail-list">
              <div><span>Status</span><strong><StatusBadge status={shipment.status} tone={shipmentStatusTone[shipment.status] || "slate"} /></strong></div>
              <div><span>Cargo</span><strong>{shipment.cargo.type}</strong></div>
              <div><span>Volume</span><strong>{shipment.cargo.volume} CBM</strong></div>
              <div><span>Weight</span><strong>{shipment.cargo.weightKg.toLocaleString()} KG</strong></div>
              <div><span>Ready date</span><strong>{shipment.schedule.readyDate}</strong></div>
              <div><span>Preferred departure</span><strong>{shipment.schedule.preferredDeparture}</strong></div>
            </div>
          </div>

          <div className="card-panel">
            <h3>Requirements</h3>
            <div className="detail-list">
              <div><span>Fragile</span><strong>{shipment.cargo.fragile ? "Yes" : "No"}</strong></div>
              <div><span>Temperature controlled</span><strong>{shipment.cargo.temperatureControlled ? "Yes" : "No"}</strong></div>
              <div><span>Hazardous</span><strong>{shipment.cargo.hazardous ? "Yes" : "No"}</strong></div>
              <div><span>Special handling</span><strong>{shipment.cargo.specialHandling || "None"}</strong></div>
              <div><span>Notes</span><strong>{shipment.cargo.notes || "No notes"}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function ExporterCapacityPage() {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState({ origin: "", destination: "", minVolume: "", minWeight: "", containerType: "All types", verifiedOnly: false, maxPrice: "" });

  const results = useMemo(() => {
    const capacity = marketplaceService.searchCapacity({
      origin: filters.origin,
      destination: filters.destination,
      minVolume: filters.minVolume ? Number(filters.minVolume) : undefined,
      minWeight: filters.minWeight ? Number(filters.minWeight) : undefined,
      containerType: filters.containerType === "All types" ? undefined : filters.containerType,
      verifiedOnly: filters.verifiedOnly,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    });

    return capacity.filter((item) => item.providerId !== currentUser?.id);
  }, [currentUser?.id, filters]);

  const clearFilters = () => {
    setFilters({ origin: "", destination: "", minVolume: "", minWeight: "", containerType: "All types", verifiedOnly: false, maxPrice: "" });
  };

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader title="Find available capacity" subtitle="Search available routes and compare matches." />

        <div className="card-panel filter-panel">
          <div className="filter-grid">
            <div className="filter-field">
              <label>Origin</label>
              <input value={filters.origin} onChange={(e) => setFilters({ ...filters, origin: e.target.value })} placeholder="Mumbai" />
            </div>
            <div className="filter-field">
              <label>Destination</label>
              <input value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })} placeholder="Rotterdam" />
            </div>
            <div className="filter-field">
              <label>Min volume</label>
              <input type="number" value={filters.minVolume} onChange={(e) => setFilters({ ...filters, minVolume: e.target.value })} placeholder="12" />
            </div>
            <div className="filter-field">
              <label>Min weight</label>
              <input type="number" value={filters.minWeight} onChange={(e) => setFilters({ ...filters, minWeight: e.target.value })} placeholder="3000" />
            </div>
            <div className="filter-field">
              <label>Container</label>
              <select value={filters.containerType} onChange={(e) => setFilters({ ...filters, containerType: e.target.value })}>
                <option value="All types">All types</option>
                <option value="40 FT Container">40 FT Container</option>
                <option value="20 FT Container">20 FT Container</option>
                <option value="40 FT High Cube">40 FT High Cube</option>
              </select>
            </div>
            <div className="filter-field">
              <label>Max price</label>
              <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} placeholder="150" />
            </div>
            <div className="filter-field">
              <label>Provider quality</label>
              <label className="check-inline">
                <input type="checkbox" checked={filters.verifiedOnly} onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })} />
                Verified only
              </label>
            </div>
            <div className="filter-actions">
              <Button variant="ghost" onClick={clearFilters}>Clear filters</Button>
            </div>
          </div>
        </div>

        <div className="results-grid">
          {results.length === 0 ? (
            <div className="empty-state">No capacity matches your current requirements.</div>
          ) : (
            results.map((entry) => (
              <div key={entry.id} className="capacity-card card-panel">
                <div className="capacity-header">
                  <div>
                    <strong>{entry.route.origin} → {entry.route.destination}</strong>
                    <p>{entry.containerType}</p>
                  </div>
                  <StatusBadge status={entry.verificationStatus === "VERIFIED" ? "Verified" : "Pending"} tone={entry.verificationStatus === "VERIFIED" ? "green" : "amber"} />
                </div>

                <div className="capacity-metrics">
                  <div><span>Available</span><strong>{entry.availableCbm} CBM</strong></div>
                  <div><span>Weight</span><strong>{entry.availableWeightKg.toLocaleString()} KG</strong></div>
                  <div><span>Transit</span><strong>{entry.transitTimeDays} days</strong></div>
                  <div><span>Price</span><strong>${entry.pricePerCbm}/CBM</strong></div>
                </div>

                <div className="capacity-footer">
                  <div>
                    <small>Departure {entry.departureDate}</small>
                    <small>Arrival {entry.arrivalDate}</small>
                  </div>
                  <div className="match-score">{entry.matchScore}% Match</div>
                </div>

                <Link to={`/exporter/capacity/${entry.id}`} className="match-link">View match</Link>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}

export function ExporterCapacityDetailPage() {
  const { capacityId } = useParams();
  const capacity = marketplaceService.getCapacity(String(capacityId));
  const navigate = useNavigate();

  if (!capacity) {
    return <AppShell role="EXPORTER"><div className="page-stack"><div className="empty-state">Matching capacity not found.</div></div></AppShell>;
  }

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader
          title="Match details"
          subtitle={`${capacity.route.origin} → ${capacity.route.destination}`}
          actions={<Button variant="primary" onClick={() => navigate(`/exporter/bookings/new?capacityId=${capacity.id}`)}>Reserve capacity</Button>}
        />

        <div className="detail-grid">
          <div className="card-panel">
            <h3>Capacity summary</h3>
            <div className="detail-list">
              <div><span>Provider</span><strong>{capacity.providerName}</strong></div>
              <div><span>Container</span><strong>{capacity.containerType}</strong></div>
              <div><span>Available cbm</span><strong>{capacity.availableCbm} CBM</strong></div>
              <div><span>Available weight</span><strong>{capacity.availableWeightKg.toLocaleString()} KG</strong></div>
              <div><span>Departure</span><strong>{capacity.departureDate}</strong></div>
              <div><span>Arrival</span><strong>{capacity.arrivalDate}</strong></div>
              <div><span>Transit</span><strong>{capacity.transitTimeDays} days</strong></div>
              <div><span>Price</span><strong>${capacity.pricePerCbm}/CBM</strong></div>
            </div>
          </div>

          <div className="card-panel">
            <h3>Why this is a match</h3>
            <ul className="check-list">
              <li>✓ Route matches your shipment corridor.</li>
              <li>✓ Capacity available for your requested volume.</li>
              <li>✓ Schedule is compatible with your delivery target.</li>
              <li>✓ Provider verification status is active.</li>
            </ul>
            <div className="match-score-large">{capacity.matchScore}% Match</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function ExporterMessagesPage() {
  const { currentUser } = useAuth();
  const [draft, setDraft] = useState("");
  const [conversations, setConversations] = useState(() =>
    marketplaceService
      .getMessages()
      .filter((conversation) => conversation.userIds.includes(currentUser?.id ?? "")),
  );
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const next = marketplaceService
      .getMessages()
      .filter((conversation) => conversation.userIds.includes(currentUser?.id ?? ""));
    setConversations(next);
    setSelectedId((current) => {
      if (!next.some((conversation) => conversation.id === current)) {
        return next[0]?.id ?? "";
      }
      return current;
    });
  }, [currentUser?.id]);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0] ?? null;

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedConversation || !draft.trim()) {
      return;
    }

    const freshMessage = marketplaceService.sendMessage(
      selectedConversation.id,
      currentUser?.id ?? "user-exporter-1",
      currentUser?.role ?? "EXPORTER",
      draft.trim(),
    );

    if (!freshMessage) {
      return;
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? { ...conversation, updatedAt: new Date().toISOString(), unreadCount: 0, messages: [...conversation.messages, freshMessage] }
          : conversation,
      ),
    );
    setDraft("");
  };

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader title="Messages" subtitle="Coordinate with providers and monitor booking updates in one place." />

        <div className="messages-layout">
          <aside className="conversation-list card-panel">
            <div className="section-heading-row compact">
              <h3>Conversations</h3>
            </div>
            {conversations.length === 0 ? (
              <div className="empty-state">No conversations yet.</div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? "active" : ""}`}
                  onClick={() => setSelectedId(conversation.id)}
                >
                  <div>
                    <strong>{conversation.title}</strong>
                    <small>{conversation.messages[conversation.messages.length - 1]?.text ?? "New conversation"}</small>
                  </div>
                  {conversation.unreadCount > 0 ? <span className="unread-pill">{conversation.unreadCount}</span> : null}
                </button>
              ))
            )}
          </aside>

          <div className="conversation-panel card-panel">
            {selectedConversation ? (
              <>
                <div className="conversation-header">
                  <div>
                    <h3>{selectedConversation.title}</h3>
                    <small>{selectedConversation.messages.length} messages</small>
                  </div>
                  <StatusBadge status="Active" tone="green" />
                </div>

                <div className="conversation-thread">
                  {selectedConversation.messages.map((message) => {
                    const isMine = message.senderId === currentUser?.id;
                    return (
                      <div key={message.id} className={`message-row ${isMine ? "mine" : "theirs"}`}>
                        <div className={`message-bubble ${isMine ? "outbound" : "inbound"}`}>
                          {message.text}
                        </div>
                        <span className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <form className="message-composer" onSubmit={handleSendMessage}>
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={3}
                    placeholder="Write a message to your provider..."
                  />
                  <div className="composer-actions">
                    <Button type="button" variant="secondary">Attach</Button>
                    <Button type="submit" variant="primary">Send message</Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="empty-state">Choose a conversation to start messaging.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function ExporterSettingsPage() {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    emailAlerts: true,
    shipmentUpdates: true,
    bookingReminders: true,
    twoFactor: false,
    pushNotifications: true,
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
    setSaved(false);
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader title="Settings" subtitle="Control your profile details and shipment communication preferences." />

        <form className="settings-layout" onSubmit={handleSave}>
          <div className="card-panel">
            <div className="section-heading-row compact">
              <h3>Profile</h3>
            </div>
            <div className="detail-list">
              <div><span>Name</span><strong>{currentUser?.name ?? "Exporter"}</strong></div>
              <div><span>Company</span><strong>{currentUser?.companyName ?? "CargoLink Exporter"}</strong></div>
              <div><span>Email</span><strong>{currentUser?.email ?? "noreply@cargolink.test"}</strong></div>
              <div><span>Location</span><strong>{currentUser?.city ?? "Mumbai"}, {currentUser?.country ?? "India"}</strong></div>
            </div>
          </div>

          <div className="card-panel">
            <div className="section-heading-row compact">
              <h3>Preferences</h3>
            </div>
            <div className="toggle-list">
              <label className="toggle-row">
                <span>Email alerts</span>
                <input type="checkbox" checked={settings.emailAlerts} onChange={() => handleToggle("emailAlerts")} />
              </label>
              <label className="toggle-row">
                <span>Shipment updates</span>
                <input type="checkbox" checked={settings.shipmentUpdates} onChange={() => handleToggle("shipmentUpdates")} />
              </label>
              <label className="toggle-row">
                <span>Booking reminders</span>
                <input type="checkbox" checked={settings.bookingReminders} onChange={() => handleToggle("bookingReminders")} />
              </label>
              <label className="toggle-row">
                <span>Two-factor authentication</span>
                <input type="checkbox" checked={settings.twoFactor} onChange={() => handleToggle("twoFactor")} />
              </label>
              <label className="toggle-row">
                <span>Push notifications</span>
                <input type="checkbox" checked={settings.pushNotifications} onChange={() => handleToggle("pushNotifications")} />
              </label>
            </div>

            <div className="settings-actions">
              <Button type="submit" variant="primary">Save changes</Button>
              {saved ? <span className="save-indicator">Saved</span> : null}
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export function ExporterBookingsPage() {
  const { currentUser } = useAuth();
  const bookings = marketplaceService.getBookings().filter((booking) => booking.exporterId === currentUser?.id);

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader title="Bookings" subtitle="Review your booking history, status changes, and payment actions." />

        <div className="table-card">
          {bookings.length === 0 ? <div className="empty-state">No bookings yet.</div> : (
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Route</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.route.origin} → {booking.route.destination}</td>
                    <td>${booking.amount}</td>
                    <td><StatusBadge status={booking.status} tone={bookingStatusTone[booking.status] || "slate"} /></td>
                    <td><Link to={`/exporter/bookings/${booking.id}`}>Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export function ExporterBookingNewPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const shipmentId = query.get("shipmentId") || "CL-SHP-1001";
  const capacityId = query.get("capacityId") || "CL-CAP-2001";
  const [confirmed, setConfirmed] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const shipment = marketplaceService.getShipment(shipmentId) ?? marketplaceService.getShipments()[0];
  const capacity = marketplaceService.getCapacity(capacityId) ?? marketplaceService.getCapacityListings()[0];

  const handleConfirm = () => {
    const booking = marketplaceService.createBooking({
      shipmentId: shipment.id,
      exporterId: shipment.exporterId,
      providerId: capacity.providerId,
      capacityId: capacity.id,
      status: "RESERVED",
      route: shipment.route,
      requestedCbm: shipment.cargo.volume,
      requestedWeightKg: shipment.cargo.weightKg,
      amount: capacity.pricePerCbm * shipment.cargo.volume,
      currency: "USD",
      reservationExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });

    if (booking) {
      setConfirmed(true);
      setPaymentReady(true);
      marketplaceService.updateShipment(shipment.id, { status: "BOOKED", bookingId: booking.id });
    }
  };

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader title="Create booking" subtitle="Reserve the selected capacity before continuing to payment." />

        {!confirmed ? (
          <div className="card-panel">
            <div className="detail-list">
              <div><span>Selected shipment</span><strong>{shipment.id}</strong></div>
              <div><span>Route</span><strong>{shipment.route.origin} → {shipment.route.destination}</strong></div>
              <div><span>Capacity</span><strong>{capacity.containerType}</strong></div>
              <div><span>Requested CBM</span><strong>{shipment.cargo.volume}</strong></div>
              <div><span>Requested weight</span><strong>{shipment.cargo.weightKg.toLocaleString()} KG</strong></div>
              <div><span>Price</span><strong>${capacity.pricePerCbm * shipment.cargo.volume}</strong></div>
            </div>
            <div className="form-actions row-actions">
              <Button variant="secondary" onClick={() => window.history.back()}>Back</Button>
              <Button variant="primary" onClick={handleConfirm}>Confirm reservation</Button>
            </div>
          </div>
        ) : (
          <div className="card-panel success-panel">
            <h3>Reservation created</h3>
            <p>Your requested capacity has been temporarily reserved.</p>
            <div className="timer">14:32</div>
            {paymentReady ? <Button variant="primary" onClick={() => window.location.assign(`/exporter/bookings/${marketplaceService.getBookings()[0]?.id || "CL-BKG-3001"}`)}>Continue to payment</Button> : null}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export function ExporterBookingDetailPage() {
  const { bookingId } = useParams();
  const booking = marketplaceService.getBooking(String(bookingId));

  if (!booking) {
    return <AppShell role="EXPORTER"><div className="page-stack"><div className="empty-state">Booking not found.</div></div></AppShell>;
  }

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader title={booking.id} subtitle={`${booking.route.origin} → ${booking.route.destination}`} />
        <div className="detail-grid">
          <div className="card-panel">
            <h3>Booking summary</h3>
            <div className="detail-list">
              <div><span>Status</span><strong><StatusBadge status={booking.status} tone={bookingStatusTone[booking.status] || "slate"} /></strong></div>
              <div><span>Shipment</span><strong>{booking.shipmentId}</strong></div>
              <div><span>Capacity</span><strong>{booking.capacityId}</strong></div>
              <div><span>Amount</span><strong>${booking.amount}</strong></div>
              <div><span>Requested volume</span><strong>{booking.requestedCbm} CBM</strong></div>
              <div><span>Requested weight</span><strong>{booking.requestedWeightKg.toLocaleString()} KG</strong></div>
            </div>
          </div>
          <div className="card-panel">
            <h3>Payment</h3>
            <p>Mock payment flow available for demo.</p>
            <Button variant="primary" onClick={() => {
              marketplaceService.updateBooking(booking.id, "CONFIRMED");
              window.location.assign(`/exporter/bookings/${booking.id}`);
            }}>Pay</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function ExporterTrackingPage() {
  const { currentUser } = useAuth();
  const shipments = marketplaceService.getShipments().filter((item) => item.exporterId === currentUser?.id);

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader title="Tracking" subtitle="Monitor the movement of your cargo from pickup to delivery." />

        <div className="list-stack">
          {shipments.map((shipment) => (
            <Link key={shipment.id} to={`/exporter/tracking/${shipment.id}`} className="list-card">
              <div>
                <strong>{shipment.route.origin} → {shipment.route.destination}</strong>
                <p>{shipment.id}</p>
              </div>
              <StatusBadge status={shipment.status} tone={shipmentStatusTone[shipment.status] || "slate"} />
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function ExporterTrackingDetailPage() {
  const { shipmentId } = useParams();
  const shipment = marketplaceService.getShipment(String(shipmentId));
  const events = shipment ? marketplaceService.getTrackingEvents(shipment.id) : [];

  if (!shipment) {
    return <AppShell role="EXPORTER"><div className="page-stack"><div className="empty-state">Tracking not found.</div></div></AppShell>;
  }

  return (
    <AppShell role="EXPORTER">
      <div className="page-stack">
        <PageHeader title={shipment.id} subtitle={`${shipment.route.origin} → ${shipment.route.destination}`} />

        <div className="timeline">
          {events.map((event) => (
            <div key={event.id} className={`timeline-item ${event.current ? "current" : ""} ${event.completed ? "completed" : "upcoming"}`}>
              <div className="timeline-dot" />
              <div>
                <strong>{event.title}</strong>
                <p>{event.description}</p>
                <small>{event.date}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
