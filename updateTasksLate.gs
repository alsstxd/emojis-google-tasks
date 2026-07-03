function atualizarTarefasAtrasadasParaHoje() {
  const nomeListaIgnorada = "Todas as tarefas";
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const hojeFormatado = Utilities.formatDate(
    hoje,
    "GMT",
    "yyyy-MM-dd'T'00:00:00'Z'"
  );

  const taskLists = Tasks.Tasklists.list().items || [];

  taskLists.forEach(list => {
    // ignora a lista consolidada
    if (list.title.trim() === nomeListaIgnorada) {
      return;
    }

    const tasks = Tasks.Tasks.list(list.id, {
      showCompleted: false,
      showHidden: false
    }).items || [];

    tasks.forEach(task => {
      if (!task.due) return;

      const dataTask = new Date(task.due);
      dataTask.setHours(0, 0, 0, 0);

      // se estiver atrasada
      if (dataTask < hoje) {
        task.due = hojeFormatado;

        Tasks.Tasks.update(
          task,
          list.id,
          task.id
        );
      }
    });
  });
}
