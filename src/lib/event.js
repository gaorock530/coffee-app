/**
 * @interface Event
 * @description creates a Events manager
 * @argument {Object} obj (optional) a object to work with
 * @argument {Event} evt (optional) a event bind to the object
 * @argument {Function} fn (optional) a function fires when event emits
 * @prop {Object} events stores all events and handlers ready to emit
 */

module.exports = class Event {
  constructor () {
    this.events = {};
    this.c = 0;
  }

  /**
   * @private {Getter} determines whether this interface is used for single event or multi 
   */
  get isSingleEvent() {
    return this._obj && this._evt && this._fn;
  }

  /**
   * @function attach attach a function to an event
   */

  static attach (obj, evt, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(evt, fn, false);
    } else if (obj.attachEvent) {
      obj.attachEvent('on' + evt, fn);
    } else {
      obj['on' + evt] = fn;
    }
  }

  /**
   * @function detach detach a function from an event
   */
  static detach (obj, evt, fn) {
    if (obj.removeEventListener) {
      obj.removeEventListener(evt, fn, false);
    } else if (obj.detachEvent) {
      obj.attachEvent('on' + evt, fn);
    } else {
      obj['on' + evt] = null;
    }
  }

  /**
   * @function add add event handler to this.events Object
   * @param {Event} evt 
   * @param {Function} fn 
   */
  add (evt, fn, once = false) {
    if (this.isSingleEvent) return;
    if(!this.events[evt]) this.events[evt] = [];
    this.events[evt].push({fn, n: this.c, done: false, once});
    // console.log('add: ['+ evt +'] ', this.events[evt]);
    return this.c++;
  }

  del (evt, n) {
    if (this.isSingleEvent) return;
    if (this.events[evt] && this.events[evt].length !== 0) {
      let removal = 0;
      this.events[evt] = this.events[evt].filter(fn => {
        if (fn.n !== n) return true;
        removal++;
        return false;
      });
      if (removal < 1) {
        console.warn(`no such function[${n}] on event[${evt}].`);
        return false;
      } else {
        console.log('del: ', removal);
        return true;
      }
    } else {
      console.warn(`no such event[${evt}].`);
      return false;
    }
  }

  /**
   * @function excute excute all functions in this.events at a given event.
   * @param {Event} evt 
   * @param {Any} after 'evt' 
   */
  excute(evt) {
    //console.warn('noting to excute.');
    if (!this.events[evt]) return 
    const args = Array.from(arguments).slice(1);
    this.events[evt].map(a => {
      a.fn.apply(a.fn, args)
      return a.done = true;
    });
    this.events[evt] = this.events[evt].filter(a => !a.once || !a.done);
    // console.log('excute event['+evt+']', this.events[evt]);
  }

  /**
   * @function destory clear out this.events.
   */
  destory () {
    this.events = {};
    return this.events;
  }
}