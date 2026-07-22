/* Format the notes in the tasks like lists */
function formatarNotasComoLista(nomeLista = null) {
  const taskLists = Tasks.Tasklists.list().items || [];

  taskLists.forEach(list => {
    // filtra por nome, se informado
    if (
      nomeLista &&
      list.title.trim() !== nomeLista.trim()
    ) {
      return;
    }

    const tasks = Tasks.Tasks.list(list.id, {
      showCompleted: true,
      showHidden: true
    }).items || [];

    tasks.forEach(task => {
      if (!task.notes) return;

      const notasFormatadas = task.notes
        .split("\n")
        .map(linha => {
          const texto = linha.trim();

          // mantém linha vazia
          if (!texto) return "";

          // ignora URLs
          if (/^https?:\/\/\S+/i.test(texto)) {
            return texto;
          }

          // evita duplicação
          if (texto.startsWith("- ")) {
            return texto;
          }

          return `- ${texto}`;
        })
        .join("\n");

      if (task.notes !== notasFormatadas) {
        task.notes = notasFormatadas;

        Tasks.Tasks.update(
          task,
          list.id,
          task.id
        );
      }
    });
  });
}
