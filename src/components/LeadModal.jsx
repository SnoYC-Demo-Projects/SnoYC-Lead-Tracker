import React, { useState, useEffect } from "react";
import { 
  X, 
  Save, 
  Building, 
  User, 
  Phone, 
  MapPin, 
  Tag, 
  Globe, 
  FileText, 
  Calendar, 
  CheckCircle, 
  IndianRupee
} from "lucide-react";
import { BUSINESS_TYPES, LEAD_SOURCES, STATUS_OPTIONS } from "../data/mockData";
import { getTodayDateString, generateNextLeadId } from "../utils/helpers";

export function LeadModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingLead, 
  existingLeads, 
  currentUser, 
  users = [], 
  isAdmin,
  initialAssignee
}) {
  const getInitialAssigneeId = () => {
    if (initialAssignee) return initialAssignee.id;
    if (!isAdmin && currentUser) return currentUser.id;
    return currentUser?.id || users[0]?.id || "";
  };

  const getInitialAssigneeName = () => {
    if (initialAssignee) return initialAssignee.name;
    if (!isAdmin && currentUser) return currentUser.name;
    return currentUser?.name || users[0]?.name || "";
  };

  const [formData, setFormData] = useState({
    id: "",
    dateLogged: getTodayDateString(),
    businessName: "",
    contactName: "",
    phone: "",
    city: "",
    businessType: BUSINESS_TYPES[0],
    source: LEAD_SOURCES[0],
    need: "",
    status: "New",
    lastContacted: getTodayDateString(),
    nextFollowUp: getTodayDateString(),
    notes: "",
    assignedToId: getInitialAssigneeId(),
    assignedToName: getInitialAssigneeName(),
    estimatedValue: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (editingLead) {
      setFormData({
        ...editingLead,
        estimatedValue: editingLead.estimatedValue || 0
      });
    } else {
      // Create new lead defaults
      const nextId = generateNextLeadId(existingLeads || []);
      const assigneeId = getInitialAssigneeId();
      const assigneeName = getInitialAssigneeName();

      setFormData({
        id: nextId,
        dateLogged: getTodayDateString(),
        businessName: "",
        contactName: "",
        phone: "",
        city: "",
        businessType: BUSINESS_TYPES[0],
        source: LEAD_SOURCES[0],
        need: "",
        status: "New",
        lastContacted: getTodayDateString(),
        nextFollowUp: getTodayDateString(),
        notes: "",
        assignedToId: assigneeId,
        assignedToName: assigneeName,
        estimatedValue: 0
      });
    }
    setErrors({});
  }, [isOpen, editingLead]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAssigneeChange = (userId) => {
    const selectedUser = users.find(u => u.id === userId);
    setFormData(prev => ({
      ...prev,
      assignedToId: userId,
      assignedToName: selectedUser ? selectedUser.name : "Unassigned"
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.businessName?.trim()) newErrors.businessName = "Business name is required";
    if (!formData.contactName?.trim()) newErrors.contactName = "Contact / owner name is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone or WhatsApp number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const finalData = {
      ...formData,
      city: formData.city?.trim() || "General",
      need: formData.need?.trim() || "General Inquiry"
    };
    onSave(finalData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-lg">
        <div className="modal-header">
          <h3>
            <Building size={20} style={{ color: "var(--primary)" }} />
            {editingLead ? `Edit Lead: ${editingLead.id}` : "Log New Lead Entry"}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className="modal-body">
            {/* Top row: ID, Date Logged, Assigned Member */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">
                  <Tag size={13} /> Lead ID
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.id}
                  onChange={(e) => handleChange("id", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={13} /> Date Logged <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dateLogged}
                  onChange={(e) => handleChange("dateLogged", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User size={13} /> Assigned Team Member
                </label>
                {isAdmin ? (
                  <select
                    className="form-select"
                    value={formData.assignedToId}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role === "admin" ? "Admin" : "Member"})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    value={`${formData.assignedToName || currentUser?.name || "You"} (Assigned to You)`}
                    disabled
                    style={{ opacity: 0.85, cursor: "not-allowed" }}
                  />
                )}
              </div>
            </div>

            {/* Business Name & Contact Name */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  <Building size={13} /> Business Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Apex Dental Solutions, Blue Horizon Cafe"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                />
                {errors.businessName && <span style={{ color: "var(--danger)", fontSize: "0.72rem" }}>{errors.businessName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User size={13} /> Owner / Contact Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Michael Scott, Priya Sharma"
                  value={formData.contactName}
                  onChange={(e) => handleChange("contactName", e.target.value)}
                />
                {errors.contactName && <span style={{ color: "var(--danger)", fontSize: "0.72rem" }}>{errors.contactName}</span>}
              </div>
            </div>

            {/* Phone/WhatsApp & Area/City */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  <Phone size={13} /> Phone / WhatsApp <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. +1 555-234-5678 or +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                {errors.phone && <span style={{ color: "var(--danger)", fontSize: "0.72rem" }}>{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin size={13} /> Area / City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Downtown Metro, South Industrial District"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                {errors.city && <span style={{ color: "var(--danger)", fontSize: "0.72rem" }}>{errors.city}</span>}
              </div>
            </div>

            {/* Business Type, Source & Status */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">
                  <Building size={13} /> Business Type
                </label>
                <select
                  className="form-select"
                  value={formData.businessType}
                  onChange={(e) => handleChange("businessType", e.target.value)}
                >
                  {BUSINESS_TYPES.map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Globe size={13} /> Lead Source
                </label>
                <select
                  className="form-select"
                  value={formData.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                >
                  {LEAD_SOURCES.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Tag size={13} /> Current Status
                </label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates: Last Contacted & Next Follow Up */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={13} /> Last Contacted
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.lastContacted}
                  onChange={(e) => handleChange("lastContacted", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={13} /> Next Follow-Up Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.nextFollowUp}
                  onChange={(e) => handleChange("nextFollowUp", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <IndianRupee size={13} /> Est. Deal Value (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 50000"
                  value={formData.estimatedValue}
                  onChange={(e) => handleChange("estimatedValue", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Need / Requirement */}
            <div className="form-group">
              <label className="form-label">
                <FileText size={13} /> Client Need / Requirement <span className="required">*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Describe what specific solution, product, or service the client is inquiring about..."
                value={formData.need}
                onChange={(e) => handleChange("need", e.target.value)}
              />
              {errors.need && <span style={{ color: "var(--danger)", fontSize: "0.72rem" }}>{errors.need}</span>}
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">
                <FileText size={13} /> Interaction Notes & Activity Log
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Log call summary, client feedback, key objections, decision-makers, or next step commitments..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={15} /> {editingLead ? "Save Changes" : "Log Lead to Tracker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
