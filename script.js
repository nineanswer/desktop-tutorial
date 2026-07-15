const STORAGE_KEY = 'simple-memo-app-items';

const memoTitleInput = document.getElementById('memoTitle');
const memoContentInput = document.getElementById('memoContent');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const memoList = document.getElementById('memoList');

let memos = loadMemos();
let editingId = null;

function loadMemos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveMemos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

function renderMemos() {
  memoList.innerHTML = '';

  if (memos.length === 0) {
    memoList.innerHTML = '<p>保存されたメモはありません。</p>';
    return;
  }

  memos.forEach((memo) => {
    const card = document.createElement('article');
    card.className = 'memo-item';

    const title = document.createElement('h3');
    title.textContent = memo.title || '(タイトルなし)';

    const content = document.createElement('p');
    content.textContent = memo.content;

    const actions = document.createElement('div');
    actions.className = 'memo-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'edit-button';
    editButton.textContent = '編集';
    editButton.addEventListener('click', () => startEdit(memo.id));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => deleteMemo(memo.id));

    actions.append(editButton, deleteButton);
    card.append(title, content, actions);
    memoList.appendChild(card);
  });
}

function clearForm() {
  memoTitleInput.value = '';
  memoContentInput.value = '';
  editingId = null;
  saveButton.textContent = 'メモを追加';
  cancelButton.classList.add('hidden');
}

function startEdit(id) {
  const memo = memos.find((item) => item.id === id);
  if (!memo) {
    return;
  }

  editingId = id;
  memoTitleInput.value = memo.title;
  memoContentInput.value = memo.content;
  saveButton.textContent = 'メモを更新';
  cancelButton.classList.remove('hidden');
}

function addOrUpdateMemo() {
  const title = memoTitleInput.value.trim();
  const content = memoContentInput.value.trim();

  if (!title && !content) {
    alert('タイトルまたは内容を入力してください。');
    return;
  }

  if (editingId !== null) {
    memos = memos.map((memo) =>
      memo.id === editingId ? { ...memo, title, content } : memo
    );
  } else {
    memos.unshift({
      id: Date.now(),
      title,
      content,
    });
  }

  saveMemos();
  renderMemos();
  clearForm();
}

function deleteMemo(id) {
  memos = memos.filter((memo) => memo.id !== id);
  saveMemos();
  renderMemos();

  if (editingId === id) {
    clearForm();
  }
}

saveButton.addEventListener('click', addOrUpdateMemo);
cancelButton.addEventListener('click', clearForm);

renderMemos();
