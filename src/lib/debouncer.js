/**
 * @interface Debouncer
 * @description represent as a time delay device, whether single event (timeout)
 *              or repeating event (interval)
 * @argument {Function} fn a function to be debounced
 * @argument {MilliSeconds} delay how it will be waiting before function runs 
 * @argument {Boolean} timeout whether using setTimeout or setInterval
 * @argument {Number} attempt if using setInverval, how many times the function excutes
 * @prop {Timer} timer a function poniter to track debouncer
 * @prop {Number} counter counting attempt times
 */
export default class Debouncer {
  constructor(fn, delay, timeout, attempt) {
    this.fn = fn;
    this.delay = delay || 5000;
    this.timeout = typeof timeout === 'boolean' ? timeout : true;
    this.timer = null;
    this.attempt = attempt || 0;
    this.counter = 0;
  }

  /**
   * @private {Getter} isValid - checking all arguments are valid.
   */
  get isValid () {
    if (typeof this.timeout !== 'boolean') throw Error('3rd argument must be a Boolean.')
    if (typeof this.delay !== 'number') throw Error('2nd argument must be a Number.');
    if (typeof this.fn !== 'function') throw Error('1st argument must be a Function.');
    return true;
  }

  /**
   * @function excute() fires when this.timeout = false
   */
  excute () {
    if (this.counter >= this.attempt) return this.reset();
    this.fn();
    this.counter++;
  }

  /**
   * @function start() start debouncing
   */
  start () {
    if (!this.isValid) return console.warn('arguments must be {fn, number, boolean}.');
    this.stop();
    if (this.timeout) this.timer = setTimeout(this.fn, this.delay);
    else this.timer = setInterval(this.excute.bind(this), this.delay);
  }
  /**
   * @function stop() stop debouncing
   */
  stop () {
    if (this.timeout) clearTimeout(this.timer);
    else clearInterval(this.timer);
    this.timer = null;
    this.counter = 0;
  }
  /**
   * @function reset() reset when this.counter >= this.attempt
   */
  reset () {
    this.stop();
    this.counter = 0;
  }
}