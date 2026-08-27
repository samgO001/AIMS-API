const fichaService = require('../services/ficha.service');
const { success, created, paginated } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

class FichaController {
  getAll = catchAsync(async (req, res) => {
    const { fichas, pagination } = await fichaService.findAll(req.query, req.user);
    return paginated(res, fichas, pagination, 'Fichas obtenidas exitosamente');
  });

  getMyFichas = catchAsync(async (req, res) => {
    const result = await fichaService.findMyFichas(req.user.id);
    return success(res, result.fichas, 'Mis fichas obtenidas exitosamente');
  });

  getStats = catchAsync(async (req, res) => {
    const stats = await fichaService.getStats();
    return success(res, stats, 'Estadísticas de fichas obtenidas exitosamente');
  });

  getById = catchAsync(async (req, res) => {
    const ficha = await fichaService.findById(req.params.id);
    return success(res, ficha, 'Detalle de ficha obtenido exitosamente');
  });

  create = catchAsync(async (req, res) => {
    const ficha = await fichaService.create(req.body);
    return created(res, ficha, 'Ficha académica creada exitosamente');
  });

  update = catchAsync(async (req, res) => {
    const ficha = await fichaService.update(req.params.id, req.body);
    return success(res, ficha, 'Ficha actualizada exitosamente');
  });

  delete = catchAsync(async (req, res) => {
    await fichaService.delete(req.params.id);
    return success(res, null, 'Ficha eliminada exitosamente');
  });
}

module.exports = new FichaController();
