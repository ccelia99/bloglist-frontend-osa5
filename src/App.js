import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(initialblogs =>
      setBlogs( initialblogs )
    )  
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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>        
  )

  const blogsToDisplay = () => {
    const list = blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />)  
      
    return list
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    console.log('User logged out')

    return
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input 
          type="text"
          value={newBlog}
          name="title"
          onChange={({ target }) => setNewBlog(target.value)}
      />
      </div>
      <div>
        author:
        <input 
          type="text"
          value={newAuthor}
          name="author"
          onChange={({ target }) => setNewAuthor(target.value)}
      />
      </div>
      <div>
        url:
        <input 
          type="text"
          value={newUrl}
          name="url"
          onChange={({ target }) => setNewUrl(target.value)}
      />
      </div>
      
      <button type="submit">create</button>
    </form>
  )
  
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog,
      author: newAuthor,
      url: newUrl,
      
    }

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
      })
      .catch(error => {
        setErrorMessage(
          `Wrong username or password`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNewBlog('')
      })   
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
            <h2>Create new</h2>
            <h2> </h2>
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