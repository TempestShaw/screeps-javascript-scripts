let roleUpgrader = {
  /** @param {Creep} creep **/
  run(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.task = "harvesting";
      creep.say("🔄 Withdraw");
    }
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.task = "upgrading";
      creep.say("🚧 upgrade");
    }

    if (creep.memory.task === "upgrading") {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
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
    if (creep.memory.task === "withdraw") {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure =>
          structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) < 2000
      });

      if (targets.length === 0) {
        let sources = creep.room.find(FIND_SOURCES);
        let location = Math.round(Math.random());
        if (creep.memory.location === undefined) {
          location = Math.round(Math.random());
          creep.memory.location = location;
        } else {
          location = creep.memory.location;
        }
        if (creep.transfer(sources[location]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[location], { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      } else {
        if (creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      }
    }
  }
};

export default roleUpgrader;
