# Exercise Tracker

    You can POST to /api/users with form data username to create a new user.

    The GET request to /api/users returns an array of every users. Each element of array is an object with username and _id props

    The returned response from POST /api/users with form data username will be an object with username and _id properties.

    You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.

    You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.

    A GET request to /api/users/:_id/logs will return the user object with a count property and a log array of all the exercises added.

    You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.

    Example:
      `/api/users/${_id}/logs?from=1989-12-31&to=1990-01-04`
      `/api/users/${_id}/logs?limit=2`
      `/api/users/${_id}/logs?from=1989-12-31&to=1990-01-04&limit=1`
