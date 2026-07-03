function excluirTodasTarefasDaLista(
  nomeLista = "📅 Com Data",
  confirmar = true
) {
  if (!confirmar) {
    throw new Error(
      "Passe confirmar=true para executar a exclusão."
    );
  }

  const taskLists = Tasks.Tasklists.list().items || [];

  const lista = taskLists.find(
    list => list.title.trim() === nomeLista.trim()
  );

  if (!lista) {
    throw new Error(
      `Lista "${nomeLista}" não encontrada.`
    );
  }

  const tarefas = Tasks.Tasks.list(lista.id, {
    showCompleted: true,
    showHidden: true
  }).items || [];

  tarefas.forEach(task => {
    Tasks.Tasks.remove(lista.id, task.id);
  });
}
