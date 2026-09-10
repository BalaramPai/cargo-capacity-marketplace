import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import AppShell from "../../components/app/AppShell";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { marketplaceService } from "../../services/mock/marketplaceService";

export function ProviderDashboardPage() {
  const { currentUser } = useAuth();
  const listings = marketplaceService.getCapacityListings().filter((entry) => entry.providerId === currentUser?.id);
  const tasks = marketplaceService.getTasks(currentUser?.id ?? "user-provider-1");

  return (
    <AppShell role="PROVIDER">
      <div className="page-stack">
        <PageHeader
          title={`Good morning, ${currentUser?.name || "Provider"}`}
          subtitle="Manage capacity, bookings, and operational readiness."
          actions={<Button variant="primary" onClick={() => window.location.assign("/provider/containers/new")}>Add capacity</Button>}
        />

        <div className="callout-block warning">
          <strong>Verification pending</strong>
          <span>Your provider account is awaiting verification before capacity can be published.</span>
        </div>

        <section className="stats-grid">
          <StatCard label="Active containers" value={listings.length} accent="blue" />
          <StatCard label="Available CBM" value={listings.reduce((sum, item) => sum + item.availableCbm, 0).toFixed(1)} accent="green" />
          <StatCard label="Active bookings" value={marketplaceService.getBookings().filter((booking) => booking.providerId === currentUser?.id).length} accent="orange" />
          <StatCard label="Upcoming departures" value={listings.filter((item) => item.status !== "COMPLETED").length} accent="purple" />
        </section>

        <div className="detail-grid">
          <div className="card-panel">
            <div className="section-heading-row">
              <h3>Upcoming departures</h3>
              <Link to="/provider/containers">View all</Link>
            </div>
            <div className="list-stack">
              {listings.slice(0, 3).map((entry) => (
                <div key={entry.id} className="list-card">
                  <div>
                    <strong>{entry.route.origin} → {entry.route.destination}</strong>
                    <p>{entry.containerType} · {entry.availableCbm} CBM available</p>
                  </div>
                  <small>{entry.departureDate}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="card-panel">
            <div className="section-heading-row">
              <h3>Operational tasks</h3>
              <Link to="/provider/operations">Open</Link>
            </div>
            <div className="list-stack">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="list-card">
                  <div>
                    <strong>{task.name}</strong>
                    <p>{task.dueDate}</p>
                  </div>
                  <StatusBadge status={task.status} tone={task.status === "COMPLETED" ? "green" : task.status === "BLOCKED" ? "red" : "amber"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function ProviderContainersPage() {
  const { currentUser } = useAuth();
  const items = marketplaceService.getCapacityListings().filter((entry) => entry.providerId === currentUser?.id);

  return (
    <AppShell role="PROVIDER">
      <div className="page-stack">
        <PageHeader title="My containers" subtitle="Manage your published and draft capacity listings." actions={<Button variant="primary" onClick={() => window.location.assign("/provider/containers/new")}>Add capacity</Button>} />

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Container</th>
                <th>Route</th>
                <th>Capacity</th>
                <th>Departure</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.containerIdentifier}</td>
                  <td>{entry.route.origin} → {entry.route.destination}</td>
                  <td>{entry.availableCbm} / {entry.totalCbm} CBM</td>
                  <td>{entry.departureDate}</td>
                  <td><StatusBadge status={entry.status} tone={entry.status === "PUBLISHED" ? "green" : entry.status === "FULL" ? "amber" : "slate"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function ProviderAddCapacityPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [state, setState] = useState({
    origin: "",
    destination: "",
    containerType: "40 FT Container",
    containerIdentifier: "",
    departureDate: "",
    arrivalDate: "",
    totalCbm: "",
    totalWeightKg: "",
    availableCbm: "",
    availableWeightKg: "",
    pricePerCbm: "",
    cargoRestrictions: "",
    notes: "",
  });

  const isVerified = currentUser?.verificationStatus === "APPROVED" || currentUser?.status === "Active";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const listing = marketplaceService.createCapacity({
      providerId: currentUser?.id ?? "user-provider-1",
      providerName: currentUser?.companyName || "OceanBridge Logistics",
      route: { origin: state.origin, destination: state.destination },
      containerType: state.containerType,
      containerIdentifier: state.containerIdentifier,
      totalCbm: Number(state.totalCbm),
      availableCbm: Number(state.availableCbm),
      totalWeightKg: Number(state.totalWeightKg),
      availableWeightKg: Number(state.availableWeightKg),
      departureDate: state.departureDate,
      arrivalDate: state.arrivalDate,
      transitTimeDays: 12,
      pricePerCbm: Number(state.pricePerCbm),
      currency: "USD",
      verificationStatus: isVerified ? "VERIFIED" : "PENDING",
      status: isVerified ? "PUBLISHED" : "DRAFT",
      cargoRestrictions: state.cargoRestrictions,
      notes: state.notes,
    });

    if (!isVerified) {
      window.alert("Your provider account is awaiting verification. Capacity has been saved as a draft but cannot be published yet.");
    }

    navigate(`/provider/containers/${listing.id}`);
  };

  return (
    <AppShell role="PROVIDER">
      <div className="page-stack">
        <PageHeader title="Add capacity" subtitle={isVerified ? "Publish new container capacity for the marketplace." : "Your provider account is awaiting verification. Drafts can be saved, but publishing is blocked until approved."} />

        {!isVerified ? <div className="callout-block warning">Your provider account is awaiting verification. Capacity can be saved as a draft but cannot be published yet.</div> : null}

        <form className="stacked-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Route</h3>
            <div className="form-grid two-col">
              <label>Origin<input value={state.origin} onChange={(e) => setState({ ...state, origin: e.target.value })} /></label>
              <label>Destination<input value={state.destination} onChange={(e) => setState({ ...state, destination: e.target.value })} /></label>
            </div>
          </div>

          <div className="form-section">
            <h3>Container</h3>
            <div className="form-grid two-col">
              <label>Container type<select value={state.containerType} onChange={(e) => setState({ ...state, containerType: e.target.value })}><option>40 FT Container</option><option>20 FT Container</option><option>40 FT High Cube</option></select></label>
              <label>Container identifier<input value={state.containerIdentifier} onChange={(e) => setState({ ...state, containerIdentifier: e.target.value })} /></label>
              <label>Departure<input type="date" value={state.departureDate} onChange={(e) => setState({ ...state, departureDate: e.target.value })} /></label>
              <label>Arrival<input type="date" value={state.arrivalDate} onChange={(e) => setState({ ...state, arrivalDate: e.target.value })} /></label>
            </div>
          </div>

          <div className="form-section">
            <h3>Capacity</h3>
            <div className="form-grid two-col">
              <label>Total CBM<input type="number" value={state.totalCbm} onChange={(e) => setState({ ...state, totalCbm: e.target.value })} /></label>
              <label>Total weight KG<input type="number" value={state.totalWeightKg} onChange={(e) => setState({ ...state, totalWeightKg: e.target.value })} /></label>
              <label>Available CBM<input type="number" value={state.availableCbm} onChange={(e) => setState({ ...state, availableCbm: e.target.value })} /></label>
              <label>Available weight KG<input type="number" value={state.availableWeightKg} onChange={(e) => setState({ ...state, availableWeightKg: e.target.value })} /></label>
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing & notes</h3>
            <div className="form-grid two-col">
              <label>Price per CBM<input type="number" value={state.pricePerCbm} onChange={(e) => setState({ ...state, pricePerCbm: e.target.value })} /></label>
              <label>Currency<select value="USD"><option>USD</option></select></label>
            </div>
            <label>Restrictions<textarea rows={3} value={state.cargoRestrictions} onChange={(e) => setState({ ...state, cargoRestrictions: e.target.value })} /></label>
            <label>Notes<textarea rows={3} value={state.notes} onChange={(e) => setState({ ...state, notes: e.target.value })} /></label>
          </div>

          <div className="form-actions row-actions">
            <Button type="button" variant="secondary">Save draft</Button>
            <Button type="submit" variant={isVerified ? "primary" : "secondary"}>{isVerified ? "Publish capacity" : "Save draft"}</Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export function ProviderBookingsPage() {
  const { currentUser } = useAuth();
  const items = marketplaceService.getBookings().filter((booking) => booking.providerId === currentUser?.id);

  return (
    <AppShell role="PROVIDER">
      <div className="page-stack">
        <PageHeader title="Bookings" subtitle="Review incoming bookings and make operational decisions." />
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Exporter</th>
                <th>Route</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.exporterId}</td>
                  <td>{booking.route.origin} → {booking.route.destination}</td>
                  <td><StatusBadge status={booking.status} tone={booking.status === "CONFIRMED" ? "green" : "amber"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function ProviderOperationsPage() {
  const { currentUser } = useAuth();
  const tasks = marketplaceService.getTasks(currentUser?.id ?? "user-provider-1");

  return (
    <AppShell role="PROVIDER">
      <div className="page-stack">
        <PageHeader title="Operations" subtitle="Manage tasks across booking preparation, pickup, and departure." />
        <div className="list-stack">
          {tasks.map((task) => (
            <div key={task.id} className="list-card">
              <div>
                <strong>{task.name}</strong>
                <p>{task.bookingId} · {task.shipmentId}</p>
              </div>
              <div className="row-actions">
                <StatusBadge status={task.status} tone={task.status === "COMPLETED" ? "green" : task.status === "BLOCKED" ? "red" : "amber"} />
                <Button variant="ghost" onClick={() => marketplaceService.updateTask(task.id, task.status === "COMPLETED" ? "PENDING" : "COMPLETED")}>Update</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function ProviderMessagesPage() {
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
      currentUser?.id ?? "user-provider-1",
      currentUser?.role ?? "PROVIDER",
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
    <AppShell role="PROVIDER">
      <div className="page-stack">
        <PageHeader title="Messages" subtitle="Coordinate with exporters on bookings and route changes." />
        <div className="messages-layout">
          <aside className="conversation-list card-panel">
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
                  <StatusBadge status="Live" tone="green" />
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
                    placeholder="Share updates with the exporter..."
                  />
                  <div className="composer-actions">
                    <Button type="button" variant="secondary">Attach</Button>
                    <Button type="submit" variant="primary">Send</Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="empty-state">Choose a conversation to start chatting.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function ProviderSettingsPage() {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    emailAlerts: true,
    routeAlerts: true,
    bookingUpdate: true,
    verificationEmails: false,
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
    <AppShell role="PROVIDER">
      <div className="page-stack">
        <PageHeader title="Settings" subtitle="Manage your provider profile and notification preferences." />
        <form className="settings-layout" onSubmit={handleSave}>
          <div className="card-panel">
            <div className="section-heading-row compact">
              <h3>Profile</h3>
            </div>
            <div className="detail-list">
              <div><span>Company</span><strong>{currentUser?.companyName ?? "OceanBridge Logistics"}</strong></div>
              <div><span>Contact</span><strong>{currentUser?.name ?? "Neha Patel"}</strong></div>
              <div><span>Location</span><strong>{currentUser?.city ?? "Rotterdam"}, {currentUser?.country ?? "Netherlands"}</strong></div>
              <div><span>Verification</span><strong>{currentUser?.verificationStatus ?? "PENDING_VERIFICATION"}</strong></div>
            </div>
          </div>

          <div className="card-panel">
            <div className="section-heading-row compact">
              <h3>Notifications</h3>
            </div>
            <div className="toggle-list">
              <label className="toggle-row">
                <span>Email alerts</span>
                <input type="checkbox" checked={settings.emailAlerts} onChange={() => handleToggle("emailAlerts")} />
              </label>
              <label className="toggle-row">
                <span>Route alerts</span>
                <input type="checkbox" checked={settings.routeAlerts} onChange={() => handleToggle("routeAlerts")} />
              </label>
              <label className="toggle-row">
                <span>Booking status updates</span>
                <input type="checkbox" checked={settings.bookingUpdate} onChange={() => handleToggle("bookingUpdate")} />
              </label>
              <label className="toggle-row">
                <span>Verification emails</span>
                <input type="checkbox" checked={settings.verificationEmails} onChange={() => handleToggle("verificationEmails")} />
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
