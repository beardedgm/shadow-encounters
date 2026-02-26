import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { createMonster, updateMonster } from '../api/monsters';
import MonsterForm from '../components/MonsterForm';

export default function MonsterCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: existing, loading } = useFetch(isEdit ? `/api/monsters/${id}` : null);

  const handleSubmit = async (data) => {
    if (isEdit) {
      await updateMonster(id, data);
    } else {
      await createMonster(data);
    }
    navigate('/');
  };

  if (isEdit && loading) return <p className="loading">Loading...</p>;

  return (
    <div className="page">
      <h1>{isEdit ? 'Edit Monster' : 'Create Monster'}</h1>
      <MonsterForm
        initial={existing}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? 'Update Monster' : 'Create Monster'}
      />
    </div>
  );
}
