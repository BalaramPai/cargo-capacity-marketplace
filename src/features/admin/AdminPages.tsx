import { Link, useParams } from "react-router-dom";

import AppShell from "../../components/app/AppShell";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { marketplaceService } from "../../services/mock/marketplaceService";
import { mockUsers } from "../../services/mock/data";

export function AdminDashboardPage() {
  const providers = mockUsers.filter((user) => user.role === "PROVIDER");
  const shipments = marketplaceService.getShipments();
  const bookings = marketplaceService.getBookings();

  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title="Marketplace overview" subtitle="Monitor platform activity and provider approvals." />

        <section className="stats-grid">
          <StatCard label="Total users" value={mockUsers.length} accent="blue" />
          <StatCard label="Verified providers" value={providers.filter((user) => user.verificationStatus === "APPROVED").length} accent="green" />
          <StatCard label="Pending verifications" value={providers.filter((user) => user.verificationStatus === "PENDING_VERIFICATION").length} accent="orange" />
          <StatCard label="Active shipments" value={shipments.filter((item) => item.status !== "DELIVERED").length} accent="purple" />
          <StatCard label="Active bookings" value={bookings.filter((item) => item.status !== "COMPLETED").length} accent="blue" />
          <StatCard label="Capacity listed" value={marketplaceService.getCapacityListings().length} accent="green" />
        </section>

        <div className="detail-grid">
          <div className="card-panel">
            <div className="section-heading-row"><h3>Pending provider verification</h3><Link to="/admin/providers">Manage</Link></div>
            <div className="list-stack">
              {providers.map((provider) => (
                <div key={provider.id} className="list-card">
                  <div>
                    <strong>{provider.companyName}</strong>
                    <p>{provider.email}</p>
                  </div>
                  <StatusBadge status={provider.verificationStatus || "PENDING_VERIFICATION"} tone={provider.verificationStatus === "APPROVED" ? "green" : "amber"} />
                </div>
              ))}
            </div>
          </div>

          <div className="card-panel">
            <div className="section-heading-row"><h3>Operational alerts</h3><Link to="/admin/disputes">Review</Link></div>
            <div className="list-stack">
              {marketplaceService.getDisputes().slice(0, 3).map((dispute) => (
                <div key={dispute.id} className="list-card">
                  <div>
                    <strong>{dispute.title}</strong>
                    <p>{dispute.status}</p>
                  </div>
                  <StatusBadge status={dispute.status} tone={dispute.status === "RESOLVED" ? "green" : "amber"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function AdminProvidersPage() {
  const providers = mockUsers.filter((user) => user.role === "PROVIDER");

  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title="Provider verification" subtitle="Review provider profiles and approve or reject applications." />
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td>{provider.companyName || provider.name}</td>
                  <td>{provider.email}</td>
                  <td><StatusBadge status={provider.verificationStatus || "PENDING_VERIFICATION"} tone={provider.verificationStatus === "APPROVED" ? "green" : "amber"} /></td>
                  <td><Link to={`/admin/providers/${provider.id}`}>Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function AdminProviderDetailPage() {
  const { providerId } = useParams();
  const provider = mockUsers.find((user) => user.id === providerId && user.role === "PROVIDER");

  if (!provider) {
    return <AppShell role="ADMIN"><div className="page-stack"><div className="empty-state">Provider not found.</div></div></AppShell>;
  }

  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title={provider.companyName || provider.name} subtitle="Review business and verification details." actions={<><Button variant="success" onClick={() => { provider.verificationStatus = "APPROVED"; window.location.assign("/admin/providers"); }}>Approve</Button><Button variant="danger" onClick={() => { provider.verificationStatus = "REJECTED"; window.location.assign("/admin/providers"); }}>Reject</Button></>} />

        <div className="detail-grid">
          <div className="card-panel">
            <h3>Business details</h3>
            <div className="detail-list">
              <div><span>Contact</span><strong>{provider.name}</strong></div>
              <div><span>Email</span><strong>{provider.email}</strong></div>
              <div><span>Phone</span><strong>{provider.phone}</strong></div>
              <div><span>City</span><strong>{provider.city}</strong></div>
              <div><span>Country</span><strong>{provider.country}</strong></div>
            </div>
          </div>
          <div className="card-panel">
            <h3>Verification status</h3>
            <StatusBadge status={provider.verificationStatus || "PENDING_VERIFICATION"} tone={provider.verificationStatus === "APPROVED" ? "green" : provider.verificationStatus === "REJECTED" ? "red" : "amber"} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function AdminShipmentsPage() {
  const shipments = marketplaceService.getShipments();

  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title="Shipments" subtitle="Monitor exporter shipments across routes and statuses." />
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Route</th>
                <th>Status</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>{shipment.id}</td>
                  <td>{shipment.route.origin} → {shipment.route.destination}</td>
                  <td><StatusBadge status={shipment.status} tone={shipment.status === "DELIVERED" ? "green" : "amber"} /></td>
                  <td>{shipment.cargo.volume} CBM</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function AdminBookingsPage() {
  const bookings = marketplaceService.getBookings();

  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title="Bookings" subtitle="Review all booking activity across the marketplace." />
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Route</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.route.origin} → {booking.route.destination}</td>
                  <td>${booking.amount}</td>
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

export function AdminContainersPage() {
  const containers = marketplaceService.getCapacityListings();

  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title="Containers" subtitle="Review capacity listings and container health." />
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Container</th>
                <th>Route</th>
                <th>Available</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {containers.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.containerIdentifier}</td>
                  <td>{entry.route.origin} → {entry.route.destination}</td>
                  <td>{entry.availableCbm} CBM</td>
                  <td><StatusBadge status={entry.status} tone={entry.status === "PUBLISHED" ? "green" : "amber"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function AdminUsersPage() {
  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title="Users" subtitle="Review user participation across roles." />
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td><StatusBadge status={user.status || "Active"} tone={user.status === "Pending" ? "amber" : "green"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function AdminDisputesPage() {
  const disputes = marketplaceService.getDisputes();

  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title="Disputes" subtitle="Handle customer and provider concerns efficiently." />
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute) => (
                <tr key={dispute.id}>
                  <td>{dispute.id}</td>
                  <td>{dispute.title}</td>
                  <td><StatusBadge status={dispute.status} tone={dispute.status === "RESOLVED" ? "green" : "amber"} /></td>
                  <td><Link to={`/admin/disputes/${dispute.id}`}>Resolve</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function AdminDisputeDetailPage() {
  const { disputeId } = useParams();
  const dispute = marketplaceService.getDisputes().find((item) => item.id === disputeId);

  if (!dispute) {
    return <AppShell role="ADMIN"><div className="page-stack"><div className="empty-state">Dispute not found.</div></div></AppShell>;
  }

  const advanceStatus = () => {
    const next = dispute.status === "DISPUTE_CREATED" ? "EVIDENCE_SUBMITTED" : dispute.status === "EVIDENCE_SUBMITTED" ? "UNDER_REVIEW" : "RESOLVED";
    marketplaceService.updateDispute(dispute.id, next as any);
    window.location.reload();
  };

  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title={dispute.title} subtitle="Review dispute information and move towards resolution." actions={<Button variant="primary" onClick={advanceStatus}>Advance status</Button>} />
        <div className="card-panel">
          <div className="detail-list">
            <div><span>Status</span><strong><StatusBadge status={dispute.status} tone={dispute.status === "RESOLVED" ? "green" : "amber"} /></strong></div>
            <div><span>Description</span><strong>{dispute.description}</strong></div>
            <div><span>Created</span><strong>{dispute.createdAt}</strong></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function AdminSettingsPage() {
  return (
    <AppShell role="ADMIN">
      <div className="page-stack">
        <PageHeader title="Admin settings" subtitle="Manage audit preferences and platform configuration." />
        <div className="card-panel">
          <div className="detail-list">
            <div><span>Role</span><strong>ADMIN</strong></div>
            <div><span>Audit mode</span><strong>Enabled</strong></div>
            <div><span>Notifications</span><strong>On</strong></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
