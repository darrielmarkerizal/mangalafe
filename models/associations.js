import Project from "./project.js";
import Service from "./service.js";
import ProjectService from "./projectservice.js";

const initializeAssociations = () => {
  const models = {
    Project,
    Service,
    ProjectService,
  };

  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });
};

export default initializeAssociations;
