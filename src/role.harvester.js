let roleHarvester = {
  /** @param {Creep} creep **/
  run(creep) {
    if (creep.memory.task === "harvesting") {
      let sources = creep.room.find(FIND_SOURCES, {
        filter: Source => Source.energy > 0
      });
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
      let targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      if (!targets) {
        targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: structure => {
            return (
              (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          }
        });
      }
      if (targets) {
        if (creep.transfer(targets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }

    if (creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.task = "harvesting";
      creep.say("🔄 harvest");
    }
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.task = "transferring";
      creep.say("🚧 transferr");
    }
  }
};

export default roleHarvester;
