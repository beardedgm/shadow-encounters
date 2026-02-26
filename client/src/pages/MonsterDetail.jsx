import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { deleteMonster } from '../api/monsters';
import MonsterCard from '../components/MonsterCard';

export default function MonsterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: monster, loading, error } = useFetch(`/api/monsters/${id}`);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${monster.name}?`)) return;
    await deleteMonster(id);
    navigate('/');
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!monster) return <p className="empty">Monster not found.</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>{monster.name}</h1>
        <div className="page-actions">
          <Link to={`/monsters/${id}/edit`} className="btn btn-secondary">Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
      <MonsterCard monster={monster} />
    </div>
  );
}
