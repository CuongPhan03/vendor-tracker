import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req
} from '@nestjs/common';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorsService } from './vendors.service';
import { PagingDto } from 'src/common/dto/paging.dto';
import { VendorListDto } from './dto/vendor.dto';
import { StageHistoryListDto } from './dto/stage-history.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  findAll(
    @Req() req: Request,
    @Query() query: PagingDto
  ): Promise<VendorListDto> {
    return this.vendorsService.findAll((req as any).user['id'], query);
  }

  @Patch(':id')
  async updateVendor(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateVendorDto,
  ): Promise<boolean> {
    await this.vendorsService.updateOneById((req as any).user['id'], id, body);
    return true;
  }

  @Get(':id/history')
  findHistory(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PagingDto
  ): Promise<StageHistoryListDto> {
    return this.vendorsService.findHistory((req as any).user['id'], id, query);
  }
}
