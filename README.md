# tiny-lr-notifier

Sometimes you want to communicate with a LiveReload server from a process that's different from the process that's running LiveReload. It could be from within a gulp file, within a plugin, mobile app, etc.

Thankfully, tiny-lr provides a RESTful API for requesting a LiveReload. This library is a small wrapper to that REST API, that returns promises.