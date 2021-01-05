import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, TextField, Button, Link } from '@material-ui/core'


const buttonStyles = makeStyles({
  root: {
    height: '55px'
  }
})

export default function Login ({onLogin}) {
  const buttonClass = buttonStyles()
  const [logging, setLogging] = React.useState(false)


  const onSubmit = () => {
    setLogging(true)
    setTimeout(() => {
      setLogging(false)
      if (onLogin) onLogin()
    }, 2000)
  }

  return (
    <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required fullWidth
              id="company-required"
              autoComplete="off"
              label="手机号"
              placeholder="13688886666"
              variant="outlined"
              color="primary"
          />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required fullWidth
              id="company-required"
              autoComplete="off"
              type="password"
              label="密码"
              placeholder="********"
              variant="outlined"
              color="primary"
            />
          </Grid>
          <Grid item xs={6}>
            <Link color="primary">忘记密码</Link>
          </Grid>
          <Grid item xs={6} style={{'textAlign': 'right'}}>
            <Link color="primary">注册</Link>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" 
                fullWidth variant="contained" 
                color="secondary" size="large" 
                className={buttonClass.root}>登陆</Button>
          </Grid>
        </Grid>
      </form>
  )
}