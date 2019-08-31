exports.cluster = {
  listen: {
    workers:2,
    daemon:true,
    path: '/var/run/node-web-1.sock',
    title:"eggjs-dream"
  }
}