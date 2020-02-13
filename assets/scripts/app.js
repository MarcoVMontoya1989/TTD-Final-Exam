const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const localButton = document.querySelector('#local');
const postList = document.querySelector('ul');

function sendHttpRequest(method, url, flag ,data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    if(flag === 'local') {
      // xhr.open(method, url, false);
    } else {
      // xhr.open(method, url);
    }

    xhr.responseType = 'json';

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error('Something went wrong!'));
      }
    };

    xhr.onerror = function () {
      reject(new Error('Failed to send request!'));
    };

    xhr.send(JSON.stringify(data));
  });
}

async function fetchPostsLocal() {
  const path = 'file://../File/github.json';

  try {
    const responseData = await sendHttpRequest('GET', path, 'local');
    const listOfPosts = responseData;

    renderList(listOfPosts);

  } catch (error) {
    alert(`${error.message}`);
  }
}

async function fetchPosts() {
  try {
    const responseData = await sendHttpRequest(
        'GET',
        'https://api.github.com/users',
        'api'
    );
    const listOfPosts = responseData;

    renderList(listOfPosts);

  } catch (error) {
    alert(`${error.message} Please use the Local Button`);
  }
}

function renderList(listOfPosts) {
  for (const post of listOfPosts) {
    const postEl = document.importNode(postTemplate.content, true);
    postEl.querySelector('h2').textContent = post.login.toUpperCase();
    postEl.querySelector('p').textContent = post.html_url;
    postEl.querySelector('li').id = post.id;
    listElement.append(postEl);
  }
}

fetchButton.addEventListener('click', fetchPosts);
localButton.addEventListener('click', fetchPostsLocal);
