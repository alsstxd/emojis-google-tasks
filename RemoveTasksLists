function excluirTodasAsTarefas() {
  const taskLists = Tasks.Tasklists.list().items || [];

  let totalRemovidas = 0;

  taskLists.forEach(list => {
    const tarefas = Tasks.Tasks.list(list.id, {
      showCompleted: true,
      showHidden: true
    }).items || [];

    tarefas.forEach(task => {
      Tasks.Tasks.remove(list.id, task.id);
      totalRemovidas++;
    });
  });

  Logger.log(`Total de tarefas removidas: ${totalRemovidas}`);
}
