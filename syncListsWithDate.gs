function sincronizarListaComData() {
  const nomeListaDestino = "📅 Com Data";
  const listasIgnoradas = [
    "♾️ Todas as tarefas",
    nomeListaDestino
  ];

  const taskLists = Tasks.Tasklists.list().items || [];

  const listaDestino = taskLists.find(
    list => list.title.trim() === nomeListaDestino
  );

  if (!listaDestino) {
    throw new Error(`Lista "${nomeListaDestino}" não encontrada.`);
  }

  let tarefasDestino = obterTodasTarefas(listaDestino.id);

  // 1) sincroniza tarefas concluídas
  tarefasDestino.forEach(taskDestino => {
    if (taskDestino.status !== "completed") return;
    if (!taskDestino.notes) return;

    const [listaOrigemId, tarefaOrigemId] =
      taskDestino.notes.split("|");

    try {
      const tarefaOriginal = Tasks.Tasks.get(
        listaOrigemId,
        tarefaOrigemId
      );

      if (tarefaOriginal.status !== "completed") {
        tarefaOriginal.status = "completed";
        tarefaOriginal.completed = new Date().toISOString();

        Tasks.Tasks.update(
          tarefaOriginal,
          listaOrigemId,
          tarefaOrigemId
        );
      }
    } catch (e) {}

    Tasks.Tasks.remove(
      listaDestino.id,
      taskDestino.id
    );
  });

  // recarrega lista após remoções
  tarefasDestino = obterTodasTarefas(listaDestino.id);

  taskLists.forEach(list => {
    if (listasIgnoradas.includes(list.title.trim())) {
      return;
    }

    const tasks = Tasks.Tasks.list(list.id, {
      showCompleted: false,
      showHidden: false
    }).items || [];

    tasks.forEach(task => {
      if (!task.title || !task.due) return;

      const titulo = task.title.trim();

      // valida SOMENTE por título
      const jaExiste = tarefasDestino.some(
        t =>
          t.title?.trim() === titulo &&
          t.status !== "completed"
      );

      if (jaExiste) return;

      Tasks.Tasks.insert(
        {
          title: titulo,
          due: task.due
          //notes: `${list.id}|${task.id}`
        },
        listaDestino.id
      );

      tarefasDestino.push({
        title: titulo,
        status: "needsAction"
      });
    });
  });
}

function obterTodasTarefas(listaId) {
  return (
    Tasks.Tasks.list(listaId, {
      showCompleted: true,
      showHidden: true
    }).items || []
  );
}
