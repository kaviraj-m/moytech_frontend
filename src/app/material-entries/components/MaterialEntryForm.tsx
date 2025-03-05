import { useState, useEffect } from 'react';
import { MaterialEntry, Event } from '../types';

interface Props {
  events: Event[];
  onSubmit: (formData: any) => void;
  editingEntry: MaterialEntry | null;
}

export default function MaterialEntryForm({ events, onSubmit, editingEntry }: Props) {
  const [formData, setFormData] = useState({
    contributor_name: '',
    material_type: '',
    weight: '',
    description: '',
    place: '',
    event_id: ''
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Update form data when editingEntry changes
  useEffect(() => {
    if (editingEntry) {
      setFormData({
        contributor_name: editingEntry.contributor_name,
        material_type: editingEntry.material_type,
        weight: editingEntry.weight.toString(),
        description: editingEntry.description,
        place: editingEntry.place,
        event_id: editingEntry.event_id.toString()
      });
    } else {
      // Reset form when not editing
      setFormData({
        contributor_name: '',
        material_type: '',
        weight: '',
        description: '',
        place: '',
        event_id: ''
      });
    }
  }, [editingEntry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      event_id: parseInt(formData.event_id),
      weight: parseFloat(formData.weight)
    });
    
    // Show success notification
    setNotificationMessage(editingEntry ? 'Entry updated successfully!' : 'New entry added successfully!');
    setShowNotification(true);
    
    // Reset form after submission if not editing, but keep the event_id
    if (!editingEntry) {
      const currentEventId = formData.event_id;
      setFormData({
        contributor_name: '',
        material_type: '',
        weight: '',
        description: '',
        place: '',
        event_id: currentEventId // Keep the event_id
      });
    }
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 relative border border-gray-100">
      {/* Centered Success Notification */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border-l-4 border-[#28A745] p-5 shadow-2xl rounded-lg max-w-md w-full animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#28A745]/10 p-2 rounded-full">
                <svg className="h-6 w-6 text-[#28A745]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-base font-medium text-[#343A40]">
                  {notificationMessage}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-auto bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center mb-8">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${editingEntry ? 'bg-[#007BFF]/10 text-[#007BFF]' : 'bg-[#28A745]/10 text-[#28A745]'}`}>
          {editingEntry ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </div>
        <h2 className="text-2xl font-bold text-[#343A40]">
          {editingEntry ? 'Edit Material Entry' : 'Add New Material Entry'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#343A40]">Event</label>
            <select
              name="event_id"
              value={formData.event_id}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-[#343A40] focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all"
              required
            >
              <option value="">Select Event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#343A40]">Contributor Name</label>
            <input
              type="text"
              name="contributor_name"
              value={formData.contributor_name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-[#343A40] focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all"
              placeholder="Enter contributor name"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#343A40]">Material Type</label>
            <select
              name="material_type"
              value={formData.material_type}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-[#343A40] focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all"
              required
            >
              <option value="">Select Material Type</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Diamond">Diamond</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#343A40]">Weight (g)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-[#343A40] focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all"
              placeholder="0.001"
              required
              min="0.001"
              step="0.001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#343A40]">Place</label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-[#343A40] focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all"
              placeholder="Enter location"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-[#343A40]">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-[#343A40] focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all resize-none"
              placeholder="Add description of the material..."
              required
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button 
            type="submit" 
            className="px-8 py-3 bg-gradient-to-r from-[#007BFF] to-[#0056b3] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-lg flex items-center"
          >
            {editingEntry ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Update Entry
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Entry
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}