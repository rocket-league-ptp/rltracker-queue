module.exports = (opts = {}) => {
  const defaults = {
    limit: 10,
    reset: 1000 * 60,
    rank_check: null,
  }

  const config = Object.assign({}, defaults, opts)

  const queue = []
  const idle = []

  let reset_interval
  let queue_interval

  let request_limit = config.limit

  let is_running = false

  const exec_queue = () => {
    let item;

    while (request_limit && (item = queue.shift() ) ) {
      request_limit--;
      config.rank_check(item.platform, item.id, item.callback);
    }

    while (request_limit && (item = idle.shift() ) ) {
      request_limit--;
      config.rank_check(item.platform, item.id, item.callback);
    }
  }

  // start the queue
  const run_queue = () => {
    reset_interval = setInterval(() => {
      if (queue.length === 0 && idle.length === 0) {
        clearInterval(reset_interval);
        clearInterval(queue_interval);
        is_running = false;
      }
      else {
        request_limit = config.limit
      }
    }, config.reset)

    queue_interval = setInterval(() => {
      exec_queue();
    }, 100)

    is_running = true;
  }

  return (platform, id, is_idle, callback) => {
    is_idle = !!is_idle

    if (is_idle)
      idle.push({ id: id, platform: platform, callback: callback })
    else
      queue.push({ id: id, platform: platform, callback: callback })

    if (!is_running) {
      run_queue();
    }
  }
}
