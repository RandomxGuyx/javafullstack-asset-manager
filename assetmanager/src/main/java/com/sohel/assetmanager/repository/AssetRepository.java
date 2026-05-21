package com.sohel.assetmanager.repository;

import com.sohel.assetmanager.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {
}