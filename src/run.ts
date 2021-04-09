import debug from 'debug';
import app from './app';

const port = process.env.PORT

app.set('port', port);
app.listen(
    app.get('port'),
    () => debug(`${process.env.APP_NAME}:run`)(`Express server listening on port ${port}`),
)
