const programaService = require('../services/programa.service');
const { success, created, paginated } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

class ProgramaController {
  getAll = catchAsync(async (req, res) => {
    const { programas, pagination } = await programaService.findAll(req.query);
    return paginated(res, programas, pagination, 'Programas obtenidos exitosamente');
  });

  getById = catchAsync(async (req, res) => {
    const programa = await programaService.findById(req.params.id);
    return success(res, programa, 'Programa obtenido exitosamente');
  });

  create = catchAsync(async (req, res) => {
    const programa = await programaService.create(req.body);
    return created(res, programa, 'Programa de formación creado exitosamente');
  });

  update = catchAsync(async (req, res) => {
    const programa = await programaService.update(req.params.id, req.body);
    return success(res, programa, 'Programa actualizado exitosamente');
  });

  delete = catchAsync(async (req, res) => {
    await programaService.delete(req.params.id);
    return success(res, null, 'Programa eliminado exitosamente');
  });
}

module.exports = new ProgramaController();
