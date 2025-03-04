import { Request, Response } from "express";
import { categoryService } from "../services/category.service";

import { CategoryQueryParams } from "../types/category.types";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
  categoryIdSchema,
} from "../validators/category.validator";

  export async function createCategory(req: Request, res: Response) {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await categoryService.create(validatedData);

      return res.status(201).json({
        success: true,
        data: category,
        message: "Category created successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create category",
      });
    }
  }

  export async function updateCategory(req: Request, res: Response) {
    try {
      const { id } = categoryIdSchema.parse({ id: Number(req.params.id) });
      const validatedData = updateCategorySchema.parse(req.body);

      const category = await categoryService.update(id, validatedData);

      return res.status(200).json({
        success: true,
        data: category,
        message: "Category updated successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update category",
      });
    }
  }



   export async function deleteCategory(req: Request, res: Response) {
    try {
      const { id } = categoryIdSchema.parse({ id: Number(req.params.id) });
      const category = await categoryService.delete(id);

      return res.status(200).json({
        success: true,
        data: category,
        message: "Category deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete category",
      });
    }
  }

 export  async function getCategoryById(req: Request, res: Response) {
    try {
      const { id } = categoryIdSchema.parse({ id: Number(req.params.id) });
      const category = await categoryService.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch category",
      });
    }
  }

 export async function getAllCategories(req: Request, res: Response) {
    try {
      const queryParams = categoryQuerySchema.parse({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search,
        sortBy: req.query.sortBy,
        order: req.query.order,
      }) as CategoryQueryParams;

      const { data, total } = await categoryService.findAll(queryParams);

      return res.status(200).json({
        success: true,
        data,
        total,
        message: "Categories retrieved successfully",
      });
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch categories",
      });
    }
  }


