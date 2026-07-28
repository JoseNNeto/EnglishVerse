package com.joseneto.englishverse.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.dtos.UsuarioRequestDTO;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.model.enums.TipoPerfil;
import com.joseneto.englishverse.repository.UsuarioRepository;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario criarUsuario(UsuarioRequestDTO usuarioDTO) {
        if (usuarioRepository.existsByEmail(usuarioDTO.email())) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(usuarioDTO.nome());
        novoUsuario.setEmail(usuarioDTO.email());
        novoUsuario.setSenha(passwordEncoder.encode(usuarioDTO.senha()));
        novoUsuario.setPerfil(validarPerfilInstitucional(usuarioDTO.email(), usuarioDTO.perfil()));

        return usuarioRepository.save(novoUsuario);
    }

    public TipoPerfil validarPerfilInstitucional(String email, TipoPerfil perfilInformado) {
        String emailNormalizado = email == null ? "" : email.trim().toLowerCase();
        TipoPerfil perfil = perfilInformado == null ? TipoPerfil.DISCENTE : perfilInformado;
        if (perfil == TipoPerfil.DOCENTE
                && !emailNormalizado.matches("^[^@.]+\\.[^@]+@belojardim\\.ifpe\\.edu\\.br$")) {
            throw new RuntimeException(
                    "Use o e-mail institucional docente nome.sobrenome@belojardim.ifpe.edu.br.");
        }
        if (perfil == TipoPerfil.DISCENTE
                && emailNormalizado.endsWith("@belojardim.ifpe.edu.br")) {
            throw new RuntimeException("Este e-mail pertence ao acesso docente.");
        }
        return perfil;
    }

    public Usuario atualizarNome(String email, String novoNome) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        
        usuario.setNome(novoNome);
        return usuarioRepository.save(usuario);
    }

    public Usuario atualizarSenha(String email, String senhaAntiga, String senhaNova) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (!passwordEncoder.matches(senhaAntiga, usuario.getSenha())) {
            throw new RuntimeException("A senha antiga está incorreta.");
        }

        usuario.setSenha(passwordEncoder.encode(senhaNova));
        return usuarioRepository.save(usuario);
    }

    public Usuario salvar(Usuario usuario) {
        // Criptografa a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }
}
