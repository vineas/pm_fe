export const calculateProjectProgress = (projectId, tasks) => {
  const projectTasks = tasks.filter(t => t.project_id === projectId);
  if (projectTasks.length === 0) return 0;
  
  const completedWeight = projectTasks
    .filter(t => t.status === 'done')
    .reduce((sum, t) => sum + t.bobot, 0);
  
  const totalWeight = projectTasks.reduce((sum, t) => sum + t.bobot, 0);
  
  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};