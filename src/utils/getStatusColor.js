export const getStatusColor = (status) => {
  const colors = {
    todo: 'bg-gray-100 text-gray-800',
    inprogress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};