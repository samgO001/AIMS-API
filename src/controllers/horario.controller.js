const horarioService = require('../services/horario.service');
const { success, created } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

class HorarioController {
  create = catchAsync(async (req, res) => {
    const horario = await horarioService.create(req.body);
    return created(res, horario, 'Horario creado exitosamente');
  });

  getByFicha = catchAsync(async (req, res) => {
    const horarios = await horarioService.findByFicha(req.params.fichaId);
    return success(res, horarios, 'Horarios obtenidos exitosamente');
  });

  getMyHorario = catchAsync(async (req, res) => {
    const horario = await horarioService.findMyHorario(req.user.id);
    return success(res, horario, 'Mi horario obtenido exitosamente');
  });

  delete = catchAsync(async (req, res) => {
    await horarioService.delete(req.params.id);
    return success(res, null, 'Horario eliminado exitosamente');
  });
}

module.exports = new HorarioController();
