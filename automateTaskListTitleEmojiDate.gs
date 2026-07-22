/* Add emojis to the list name for tasks with a due date (the list name must already have an emoji at the beginning) */
function automatizarGoogleTasksEmojiTituloLista() {
  const listasIgnoradas = [
    "♾️ Todas as tarefas",
    "📅 Com Data"
  ];
  const taskLists = Tasks.Tasklists.list().items || [];

  taskLists.forEach(list => {
    // Ignora as listas de cópia
    if (listasIgnoradas.includes(list.title.trim())) {
      return;
    }
    
    const emojiCategoria = obterEmojiLista(list.title);

    const tasks = Tasks.Tasks.list(list.id, {
      showCompleted: false,
      showHidden: false
    }).items || [];

    tasks.forEach(task => {
      if (!task.title) return;

      // Remove TODOS os emojis do início
      let tituloLimpo = limparTodosEmojisInicio(
        task.title
      );

      // Sem data = somente texto limpo
      if (!task.due) {
        if (task.title !== tituloLimpo) {
          task.title = tituloLimpo;
          Tasks.Tasks.update(task, list.id, task.id);
        }
        return;
      }

      // Com data = adiciona emoji da lista
      const novoTitulo = `${emojiCategoria} ${tituloLimpo}`.trim();

      if (task.title !== novoTitulo) {
        task.title = novoTitulo;
        Tasks.Tasks.update(task, list.id, task.id);
      }
    });
  });
}

function obterEmojiLista(tituloLista) {
  return tituloLista.trim().split(/\s+/)[0] || "📌";
}

function limparTodosEmojisInicio(texto) {
  let partes = texto.trim().split(/\s+/);

  // Remove todos os emojis consecutivos do início
  while (
    partes.length > 0 &&
    /\p{Extended_Pictographic}/u.test(partes[0])
  ) {
    partes.shift();
  }

  return partes.join(" ").trim();
}
