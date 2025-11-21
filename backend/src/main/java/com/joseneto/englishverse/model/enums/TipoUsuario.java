package com.joseneto.englishverse.model.enums;

public enum TipoUsuario {
    USER("user"),
    ADMIN("admin");

    private String role;

    TipoUsuario(String role) {
        this.role = role;
    }

    public String getRole() {
        return this.role;
    }
}