import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, MapPin, Image as ImageIcon, Eye, Save, X, Clock, Package, Upload, Edit, Trash2, CheckCircle, User } from 'lucide-react';

const LostAndFoundSection = ({ categories }) => {
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [lostFoundFilter, setLostFoundFilter] = useState({ category: 'all', status: 'all', otherCategory: '', sortBy: 'newest' });
  const [showLostFoundForm, setShowLostFoundForm] = useState(false);
  const [lostFoundForm, setLostFoundForm] = useState({
    itemName: '',
    description: '',
    category: categories[0] || 'electronics',
    otherCategory: '',
    status: 'lost',
    location: '',
    date: new Date().toISOString().split('T')[0],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem('userId');

  // Fetch lost and found items from backend
  useEffect(() => {
    const fetchLostFoundItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams({
          category: lostFoundFilter.category !== 'all' ? lostFoundFilter.category : '',
          status: lostFoundFilter.status !== 'all' ? lostFoundFilter.status : '',
          otherCategory: lostFoundFilter.otherCategory || '',
          sortBy: lostFoundFilter.sortBy,
        }).toString();
        console.log('Fetching with query:', queryParams);
        const response = await fetch(`https://campuslink-backend-7auz.onrender.com/api/lostfound?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch lost and found items');
        }

        console.log('Received data:', data);
        setLostFoundItems(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching items');
        console.error('Fetch error:', err);
      }
    };

    fetchLostFoundItems();
  }, [lostFoundFilter.category, lostFoundFilter.status, lostFoundFilter.otherCategory, lostFoundFilter.sortBy]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLostFoundForm({ ...lostFoundForm, image: file });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setLostFoundForm({ ...lostFoundForm, image: null });
      setImagePreview(null);
    }
  };

  // Clean up preview URL
  const handleCloseModal = () => {
    setShowLostFoundForm(false);
    setImagePreview(null);
    setSelectedItem(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setError('');
  };

  // Handle form submission
  const handleLostFoundSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (lostFoundForm.category === 'other' && !lostFoundForm.otherCategory.trim()) {
      setError('Other category is required when category is "other"');
      return;
    }
    if (lostFoundForm.category !== 'other' && lostFoundForm.otherCategory.trim()) {
      setError('Other category must be empty when category is not "other"');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('itemName', lostFoundForm.itemName);
    formDataToSend.append('description', lostFoundForm.description);
    formDataToSend.append('category', lostFoundForm.category);
    formDataToSend.append('otherCategory', lostFoundForm.category === 'other' ? lostFoundForm.otherCategory : '');
    formDataToSend.append('status', lostFoundForm.status);
    formDataToSend.append('location', lostFoundForm.location);
    formDataToSend.append('date', lostFoundForm.date);
    if (lostFoundForm.image) {
      formDataToSend.append('image', lostFoundForm.image);
    }

    try {
      const token = localStorage.getItem('token');
      const url = selectedItem ? `https://campuslink-backend-7auz.onrender.com/api/lostfound/${selectedItem._id}` : 'https://campuslink-backend-7auz.onrender.com/api/lostfound';
      const method = selectedItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit lost/found item');
      }

      setLostFoundItems(selectedItem
        ? lostFoundItems.map(item => item._id === data._id ? data : item)
        : [...lostFoundItems, data]);
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'An error occurred while submitting');
      console.error('Submit error:', err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://campuslink-backend-7auz.onrender.com/api/lostfound/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to delete item');
        }

        setLostFoundItems(lostFoundItems.filter(item => item._id !== id));
      } catch (err) {
        setError(err.message || 'An error occurred while deleting');
        console.error('Delete error:', err);
      }
    }
  };

  // Handle mark as found
  const handleMarkAsFound = async (id) => {
    if (window.confirm('Are you sure you want to mark this item as found?')) {
      try {
        const token = localStorage.getItem('token');
        const currentUserId = localStorage.getItem('userId');
        const response = await fetch(`https://campuslink-backend-7auz.onrender.com/api/lostfound/${id}/found`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ foundBy: currentUserId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to mark as found');
        }

        setLostFoundItems(lostFoundItems.map(item => item._id === id ? data : item));
      } catch (err) {
        setError(err.message || 'An error occurred while marking as found');
        console.error('Mark as found error:', err);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Lost & Found</h2>
          <p className="text-gray-600 mt-1">Report or search for lost/found items</p>
        </div>
        <button
          onClick={() => setShowLostFoundForm(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <Filter size={20} className="text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={lostFoundFilter.category}
            onChange={(e) => setLostFoundFilter({ ...lostFoundFilter, category: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={lostFoundFilter.status}
            onChange={(e) => setLostFoundFilter({ ...lostFoundFilter, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <input
            type="text"
            value={lostFoundFilter.otherCategory}
            onChange={(e) => setLostFoundFilter({ ...lostFoundFilter, otherCategory: e.target.value })}
            placeholder="Other Category"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={lostFoundFilter.sortBy}
            onChange={(e) => setLostFoundFilter({ ...lostFoundFilter, sortBy: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lostFoundItems.map((item) => {
          const isOwner = currentUserId && item.postedBy && currentUserId === item.postedBy._id; // Null check
          return (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
                {item.status === 'lost' && !item.foundBy && (
                  <button
                    onClick={() => handleMarkAsFound(item._id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <CheckCircle size={20} />
                  </button>
                )}
              </div>

              <div className="mb-4">
                {item.image ? (
                  <img src={item.image} alt={item.itemName} className="w-full h-40 object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon size={40} className="text-gray-400" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.itemName}</h3>
              <p className="text-gray-600 mb-3">{item.description}</p>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package size={16} />
                  <span>{item.otherCategory || (item.category.charAt(0).toUpperCase() + item.category.slice(1))}</span>
                </div>
                {item.foundBy && (
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>Found by: {item.foundBy.name || 'Unknown'}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>Posted by: {item.postedBy?.name || 'Unknown'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                {isOwner && (
                  <div>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setLostFoundForm({
                          itemName: item.itemName,
                          description: item.description,
                          category: item.category,
                          otherCategory: item.otherCategory,
                          status: item.status,
                          location: item.location,
                          date: item.date.split('T')[0],
                          image: null,
                        });
                        setShowLostFoundForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Item Modal */}
      {showLostFoundForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(134, 133, 133, 0.25), rgba(100, 100, 100, 0.05))',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <div className="no-scrollbar">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {selectedItem ? 'Edit Item' : 'Add Lost/Found Item'}
              </h3>
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              <form onSubmit={handleLostFoundSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={lostFoundForm.itemName}
                    onChange={(e) => setLostFoundForm({ ...lostFoundForm, itemName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={lostFoundForm.description}
                    onChange={(e) => setLostFoundForm({ ...lostFoundForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={lostFoundForm.category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setLostFoundForm({
                        ...lostFoundForm,
                        category: newCategory,
                        otherCategory: newCategory === 'other' ? lostFoundForm.otherCategory : '',
                      });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {lostFoundForm.category === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Other Category</label>
                    <input
                      type="text"
                      value={lostFoundForm.otherCategory}
                      onChange={(e) => setLostFoundForm({ ...lostFoundForm, otherCategory: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={50}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={lostFoundForm.status}
                    onChange={(e) => setLostFoundForm({ ...lostFoundForm, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="lost">Lost</option>
                    {/* <option value="found">Found</option> */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={lostFoundForm.location}
                    onChange={(e) => setLostFoundForm({ ...lostFoundForm, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={lostFoundForm.date}
                    onChange={(e) => setLostFoundForm({ ...lostFoundForm, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <div className="flex items-center space-x-2">
                    <label className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors flex items-center space-x-2">
                      <Upload size={16} className="text-gray-500" />
                      <span className="text-gray-600">Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    disabled={selectedItem && (!currentUserId || !selectedItem.postedBy || currentUserId !== selectedItem.postedBy._id)}
                  >
                    <Save size={16} />
                    <span>{selectedItem ? 'Update' : 'Submit'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFoundSection;