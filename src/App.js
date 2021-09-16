import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(initialblogs =>
        setBlogs( initialblogs )
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    console.log('User logged out')

    return
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlogs => {
        setErrorMessage(
          `a new blog of ${newBlog} by ${newAuthor}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setBlogs(blogs.concat(returnedBlogs))
        setNewBlog('')
        setNewAuthor('')
        setNewUrl('')
      })
      .catch(() => {
        setErrorMessage(
          'Wrong username or password'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNewBlog('')
        setNewAuthor('')
        setNewUrl('')
      })

  }

  const blogsToDisplay = () => {
    const list = blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />)

    return list
  }


  return (
    <div>
      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        (
          <>
            <div>
              <h2>Blogs</h2>
              <p>{user.name} logged in
                <button onClick={() => logOut()}>
            Logout
                </button></p>

            </div>
            <div>
              {blogForm()}
            </div>
            <div>
              {blogsToDisplay()}
            </div>
          </> )}
    </div>
  )
}

export default App