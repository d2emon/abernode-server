```
----




```

### If not username

```

                         A B E R  M U D

                  By Alan Cox, Richard Acott Jim Finnis

{createdAt}
{startedAt}

By what name shall I call you?
*[username::15] -> checkUser
{username:error}
```

### End If

### If user exists

```

This persona already exists, what is the password?
*[password::] -> login
{password:error}
```

### Else

```
Did I get the name right {username}?
[y/n]
Creating new persona...
Give me a password for this persona
*[password::] -> login
{password:error}
```

### End If

```
----
{!username && messageOfTheDay}
----
{...talker...}
```