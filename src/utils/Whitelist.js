/**
 * Patches certain functions to avoid whitelisted creeps from being targeted as hostile.
 */
const WHITELIST = ["Lysine"];

const _find = Room.prototype.find;

Room.prototype.find = function (type, opts) {
  const ret = _find.call(this, type, opts);
  if (type !== FIND_HOSTILE_CREEPS) {
    return ret;
  }
  return ret.filter(c => !WHITELIST.includes(c.owner.username));
};

const _findClosestByRange = RoomPosition.prototype.findClosestByRange;

RoomPosition.prototype.findClosestByRange = function (type, opts) {
  if (type === FIND_HOSTILE_CREEPS) {
    const hostiles = Game.rooms[this.roomName].find(FIND_HOSTILE_CREEPS, {
      filter: c => !WHITELIST.includes(c.owner.username)
    });
    return _findClosestByRange.call(this, hostiles, opts);
  }
  return _findClosestByRange.call(this, type, opts);
};

const _findClosestByPath = RoomPosition.prototype.findClosestByPath;

RoomPosition.prototype.findClosestByPath = function (type, opts) {
  if (type === FIND_HOSTILE_CREEPS) {
    const hostiles = Game.rooms[this.roomName].find(FIND_HOSTILE_CREEPS, {
      filter: c => !WHITELIST.includes(c.owner.username)
    });
    return _findClosestByPath.call(this, hostiles, opts);
  }
  return _findClosestByPath.call(this, type, opts);
};
