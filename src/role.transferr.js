let roleTransferr = {
  /** @param {Creep} creep **/
  run(creep) {
    let contain = creep.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
          structure.store[RESOURCE_ENERGY] > 0
        );
      }
    });

    if (creep.store[RESOURCE_ENERGY] === 0 && contain.length === 0) {
      creep.memory.task = "harvesting";
      creep.say("🔄 harvest");
    }
    if (creep.store[RESOURCE_ENERGY] === 0 && contain.length > 0) {
      creep.memory.task = "withdraw";
      creep.say("🔄 Withdraw");
    }
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.task = "transfer";
      creep.say("🚧 transfer");
    }
    if (creep.memory.task === "upgrading") {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
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
    if (creep.memory.task === "withdraw") {
      if (creep.withdraw(contain[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(contain[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }

    if (creep.memory.task === "transfer") {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure =>
          (structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
          (structure.structureType === STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }
  }
};

export default roleTransferr;
