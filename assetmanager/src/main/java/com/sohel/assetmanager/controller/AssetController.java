package com.sohel.assetmanager.controller;

import com.sohel.assetmanager.entity.Asset;
import com.sohel.assetmanager.service.AssetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")

@CrossOrigin(origins = "*")
public class AssetController {

    @Autowired
    private AssetService assetService;

    @GetMapping
    public List<Asset> getAssets() {
        return assetService.getAllAssets();
    }

    @PostMapping
    public Asset addAsset(@RequestBody Asset asset) {
        return assetService.saveAsset(asset);
    }

    @DeleteMapping("/{id}")
    public String deleteAsset(@PathVariable Long id) {

        assetService.deleteAsset(id);

        return "Asset Deleted Successfully";
    }
}