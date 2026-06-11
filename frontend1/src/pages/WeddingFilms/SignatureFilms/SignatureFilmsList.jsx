import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye, Star, Copy, Archive, PlaySquare } from 'lucide-react';
import { useFilmsApi } from '../../../api/films';
import DeleteModal from '../../../components/shared/DeleteModal';
import { useNotification } from '../../../context/NotificationContext';

const ActionMenu = ({ filmId, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-10 animate-in fade-in zoom-in-95 duration-200">
          <Link to={`/films/signature/edit/${filmId}`} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 w-full text-left">
            <Edit2 className="w-4 h-4" /> Edit Film
          </Link>
          <div className="h-px bg-zinc-100 my-1"></div>
          <button onClick={() => onDelete(filmId)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
            <Trash2 className="w-4 h-4" /> Delete Film
          </button>
        </div>
      )}
    </div>
  );
};

const SignatureFilmsList = () => {
  const { loading, error, fetchFilms, deleteFilm } = useFilmsApi();
  const [films, setFilms] = useState([]);
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, filmId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useNotification();

  const loadFilms = async () => {
    const data = await fetchFilms();
    setFilms(data || []);
  };

  useEffect(() => {
    loadFilms();
  }, [fetchFilms]);

  const confirmDelete = (id) => {
    setDeleteModal({ isOpen: true, filmId: id });
  };

  const handleDeleteFilm = async () => {
    if (!deleteModal.filmId) return;
    
    setIsDeleting(true);
    try {
      await deleteFilm(deleteModal.filmId);
      showSuccess('Film deleted successfully.');
      loadFilms();
    } catch (error) {
      console.error('Failed to delete film:', error);
      showError('Failed to delete film.');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, filmId: null });
    }
  };
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search films..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
          />
        </div>
        
        <Link 
          to="/films/signature/create" 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Create Film
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <th className="p-4 pl-6 font-medium">Film Details</th>
                <th className="p-4 font-medium hidden md:table-cell">Duration</th>
                <th className="p-4 font-medium hidden sm:table-cell">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-zinc-500">Loading films...</td>
                </tr>
              ) : films.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-zinc-500">No films found.</td>
                </tr>
              ) : films.map((film) => (
                <tr key={film._id || film.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-14 bg-zinc-100 rounded-lg overflow-hidden shrink-0 relative">
                        <img src={film.thumbnail} alt={film.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <PlaySquare className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-zinc-900">{film.title}</h4>
                          {film.featured && (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs font-medium text-zinc-500">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {film.views}</span>
                          <span className="md:hidden">• {film.duration}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm font-medium text-zinc-600">
                    {film.duration}
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="inline-flex px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-full border border-zinc-200">
                      {film.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full ${
                      film.status === 'Published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                    }`}>
                      {film.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <ActionMenu filmId={film._id || film.id} onDelete={confirmDelete} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <DeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, filmId: null })}
        onConfirm={handleDeleteFilm}
        isDeleting={isDeleting}
        title="Delete Signature Film?"
        message="Are you sure you want to permanently delete this signature film? This action cannot be undone."
      />
    </div>
  );
};

export default SignatureFilmsList;
