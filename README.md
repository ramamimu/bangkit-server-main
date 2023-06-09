## Documentation

### _link_

```https
https://cc-main-server-oislxufxaa-et.a.run.app
```

### _error_

Each response always contains error information in `error` variable. If `error` is `true` indicating an error occurred.

- response
  ```typescript
  {
    error: boolean,
    message: string
  }
  ```

<br/>
<br/>

> ## For Android

### _register_

```http
POST /register
```

- method

  - POST

- body

  ```typescript
  {
    email: string,
    password: string,
    fullname: string,
  }
  ```

- response
  ```typescript
  {
    error: boolean,
    message: string
  }
  ```

### _Login_

```http
POST /login
```

- method

  - POST

- body

  ```typescript
  {
    email: string,
    password: string
  }
  ```

- response

  ```typescript
  {
    error: boolean,
    data:[
      {
        User_ID: string,
        FullName: string,
        Email: string,
        Password: string,
        Latitude: number,
        Longitude: number
      }
    ],
    message: string
  }
  ```

### _logout_

```http
GET /logout
```

- method

  - GET

- response
  ```typescript
  {
    error: boolean,
    message: string
  }
  ```

### _logged_

```http
GET /logged
```

- method

  - GET

- response
  ```typescript
  {
    error: boolean,
    message: string
  }
  ```
