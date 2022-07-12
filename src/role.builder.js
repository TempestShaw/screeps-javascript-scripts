let roleBuilder = {
  /** @param {Creep} creep **/
  run(creep) {
    let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.task = "harvesting";
      creep.say("🔄 harvest");
    }
    if (creep.store.getFreeCapacity() === 0 && targets.length > 0) {
      creep.memory.task = "building";
      creep.say("🚧 build");
    }
    if (creep.store.getFreeCapacity() === 0 && targets.length === 0) {
      creep.memory.task = "transferring";
      creep.say("🚧 transferr");
    }

    if (creep.memory.task === "building") {
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }
    if (creep.memory.task === "harvesting") {
      let sources = creep.room.find(FIND_SOURCES);
      let location = Math.round(Math.random());
      if (creep.memory.location === undefined) {
        location = Math.round(Math.random());
        creep.memory.location = location;
      } else {
        location = creep.memory.location;
      }

      if (creep.harvest(sources[location]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[location], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
    if (creep.memory.task === "transferring") {
      let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      if (!target) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: structure => {
            return (
              (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          }
        });
      }
      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }
  }
};

export default roleBuilder;
